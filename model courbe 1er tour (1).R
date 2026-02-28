# ============================================================
# Monte Carlo : S simulations de courbes (Option A)
# - Processus latent sur logits : eta_t = (1-kappa) eta_{t-1} + W nu_t + eps_t
# - Vote utile seulement sur la fin : transformation deterministe continue
# - Sorties : moyenne + IC central 75% (quantiles 12.5% / 87.5%)
# - Plots : courbes moyennes + bandes (une figure par candidat)
# ============================================================

rm(list=ls())
set.seed(123)
suppressPackageStartupMessages(library(MASS))

# ----------------------------
# Helpers
# ----------------------------
softmax <- function(x) {
  z <- x - max(x)
  ez <- exp(z)
  ez / sum(ez)
}

cos_sim <- function(a, b) {
  den <- sqrt(sum(a*a)) * sqrt(sum(b*b))
  if (den == 0) return(0)
  sum(a*b) / den
}

# ----------------------------
# Inputs
# ----------------------------
W <- rbind(
  c(1.0, 0.0, 0.0),
  c(0.8, 0.2, 0.0),
  c(0.5, 0.5, 0.0),
  c(0.0, 1.0, 0.0),
  c(0.0, 0.3, 0.7),
  c(0.0, 0.0, 1.0),
  c(0.0, 0.0, 1.0)
)
K <- nrow(W)
B <- ncol(W)

#psi <- 8*c(1, 0, 0, 0, 0, -1, 0)
psi <- 8*c(1, 0, 0.5, 0, 0, 0, 0)
#psi <- 8*c(1, 0, 1, 0, 0, -1, 0)
#psi <- 8*c(1, 0, 0.5, -1, 0, -1, 0)
#psi <- 8*c(0.5, 0.5, 0.5, 0, 0, -1, 0)
#psi <- 8*c(0, 0, 0, 0, 0.5, -1, 0)
#psi <- 8*c(0, 0, 0, 0, 0, -1, 0)
#psi <- 8*c(1, 0, 0, 0, 2, -2, 0)

psi <- psi - mean(psi)

# Couleurs demandées (ordre des 7 candidats)
cols <- c("red", "darkgreen", "pink", "yellow", "blue", "darkblue", "black")

# Conditions initiales (parts jour 1)
v0 <- c(0.12, 0.09, 0.135, 0.17, 0.08, 0.35, 0.055)
stopifnot(length(v0) == K)
stopifnot(abs(sum(v0) - 1) < 1e-12)

# Horizon
T <- 365
t_seq <- 1:T

# Vote utile : activation en fin
T0 <- T-10            # ~ derniers 14 jours (sur 120)
tau0 <- T - T0
s_tau <- 10
activation <- function(t) {
  tau_t <- T - t
  1 / (1 + exp((tau_t - tau0) / s_tau))
}

# Dynamique
sigma_f <- c(0.01, 0.005, 0.01)
Qf <- diag(sigma_f^2, B)

sigma_eps <- rep(0.01, K)
D <- diag(sigma_eps^2, K)

kappa <- 0.00  # mean-reversion sur eta (0 = RW). Essayer 0.01-0.03 si besoin.

# Vote utile (seuil doux + redistribution proximité cosinus + "viabilité")
tau_vote <- 0.1
s_v <- 0.5
lambda_cos <- 6
beta_viab <- 5
eps_viab <- 1e-4
viability <- function(v) log(v + eps_viab)
r_soft <- function(vk) 1 / (1 + exp(-(vk - tau_vote) / s_v))

# IMPORTANT : version "non inversée" et plus stable :
# on autorise k=j dans la redistribution (une part peut rester sur la source)
vote_utile_transform <- function(v, W, psi, lambda_cos=6, beta_viab=2.5) {
  K <- length(v)
  
  r <- vapply(v, r_soft, numeric(1))
  m <- (1 - r) * v
  v_keep <- r * v
  
  A <- matrix(0, K, K)
  for (j in 1:K) {
    scores <- rep(0, K)
    for (k in 1:K) {
      cs <- cos_sim(W[j,], W[k,])
      kern <- cs^lambda_cos
      att  <- exp(psi[k] + beta_viab * viability(v[k]))
      scores[k] <- kern * att
    }
    denom <- sum(scores)
    if (denom <= 0) {
      scores <- exp(beta_viab * viability(v))
      denom <- sum(scores)
    }
    A[j,] <- scores / denom
  }
  
  v_new <- v_keep
  for (k in 1:K) {
    v_new[k] <- v_new[k] + sum(m * A[,k])
  }
  
  v_new <- pmax(v_new, 0)
  v_new / sum(v_new)
}

# ----------------------------
# 1 simulation : retourne v_base et v_obs (T x K)
# ----------------------------
simulate_one <- function() {
  eta <- matrix(NA, T, K)
  v_base <- matrix(NA, T, K)
  v_obs  <- matrix(NA, T, K)
  
  eta[1,] <- log(v0)
  eta[1,] <- eta[1,] - mean(eta[1,])
  
  eta <- matrix(NA, T, K-1)
  eta[1,] <- log(v0[1:(K-1)] / v0[K])   # logits relatifs à la baseline
  
  
  v_base[1,] <- softmax(c(eta[1,],0))
  v_obs[1,]  <- v_base[1,]
  
  for (t in 2:T) {
    nu  <- as.numeric(mvrnorm(1, mu=rep(0,B), Sigma=Qf))
    eps <- as.numeric(mvrnorm(1, mu=rep(0,K), Sigma=D))
    u   <- as.numeric(W %*% nu) + eps
    
    delta <- - 0.0005  # ~ drift per day on logit scale (tune)
    u[4] <- u[4] + delta
    
    # compenser sur les autres selon proximité à 4
    sim <- sapply(1:K, function(k) cos_sim(W[4,], W[k,]))
    sim[4] <- 0
    wgt <- sim / sum(sim)
    
    u <- u - delta * wgt   
    
    u_rel <- u[1:(K-1)]                        # n'update pas la baseline
    
    eta[t,] <- (1 - kappa) * eta[t-1,] + u_rel
    
    #eta[t,] <- (1 - kappa) * eta[t-1,] + u
    eta_full <- c(eta[t,], 0)
    
    v_base[t,] <- softmax(eta_full)
    
    a_t <- activation(t)
    v_tilde <- vote_utile_transform(v_base[t,], W, psi, lambda_cos, beta_viab)
    v_obs[t,] <- (1 - a_t) * v_base[t,] + a_t * v_tilde
    v_obs[t,] <- v_obs[t,] / sum(v_obs[t,])
  }
  
  list(v_base=v_base, v_obs=v_obs)
}

# ----------------------------
# Monte Carlo
# ----------------------------
S <- 100  # nombre de simulations (augmentez si besoin)
vobs_arr <- array(NA_real_, dim=c(S, T, K))

for (s in 1:S) {
  sim <- simulate_one()
  vobs_arr[s,,] <- sim$v_obs
}


# Statistiques : moyenne + IC 90% (10% / 90%)
med_v <- apply(vobs_arr, c(2,3), median)
lo_v   <- apply(vobs_arr, c(2,3), quantile, probs=0.1)
hi_v   <- apply(vobs_arr, c(2,3), quantile, probs=0.9)

# ----------------------------
# Plot : une figure par candidat (moyenne + bande 75%)
# ----------------------------
X11()
op <- par(no.readonly=TRUE)
par(mfrow=c(4,2), mar=c(4,4,2,1))  # 7 candidats -> 8 cases (1 vide)

for (k in 1:K) {
  y_med <- med_v[,k]
  y_lo   <- lo_v[,k]
  y_hi   <- hi_v[,k]
  
  ylim <- range(c(y_lo, y_hi), na.rm=TRUE)
  
  plot(t_seq, y_med, type="n", ylim=ylim,
       xlab="Jour", ylab="Part",
       main=paste0("Candidat ", k, " : moyenne + IC 75%"))
  
  # bande d'incertitude
  polygon(c(t_seq, rev(t_seq)),
          c(y_lo, rev(y_hi)),
          col=adjustcolor(cols[k], alpha.f=0.20),
          border=NA)
  
  # courbe moyenne
  lines(t_seq, y_med, col=cols[k], lwd=2)
  
  # début vote utile
  abline(v=T0, lty=2)
}

# case vide si mfrow 4x2
plot.new()
par(op)

# ----------------------------
# (Optionnel) : un plot global des moyennes seules (sans bandes)
# ----------------------------
X11()
op <- par(no.readonly=TRUE)
par(mfrow=c(1,1), mar=c(4,4,2,1))

# bornes globales pour l'axe y
ylim <- range(c(lo_v, hi_v), na.rm=TRUE)

plot(t_seq, med_v[,1], type="n",
     ylim=ylim,
     xlab="Jour", ylab="Part",
     main="Moyenne Monte Carlo (IC 75%)")

# Bandes d'incertitude + courbes
for (k in 1:K) {
  
  # bande 75%
  polygon(c(t_seq, rev(t_seq)),
          c(lo_v[,k], rev(hi_v[,k])),
          col=adjustcolor(cols[k], alpha.f=0.18),
          border=NA)
  
}

# Courbes moyennes au-dessus des bandes
matlines(t_seq, med_v, lty=1, col=cols, lwd=2)

abline(v=T0, lty=2)

legend("topright",
       legend=paste("Candidat", 1:K),
       col=cols,
       lty=1,
       lwd=2,
       bty="n",
       cex=0.85)

par(op)

# ----------------------------
# Données résumées (data.frame) si vous voulez exporter
# ----------------------------
df <- data.frame(day=t_seq, activation=sapply(t_seq, activation))
for (k in 1:K) {
  df[[paste0("mean_",k)]] <- med_v[,k]
  df[[paste0("lo75_",k)]] <- lo_v[,k]
  df[[paste0("hi75_",k)]] <- hi_v[,k]
}
print(head(df, 10))



# ============================================================
# SECOND ROUND MODEL M(W;A,B)
# ============================================================

# Softmax for 4 outcomes
softmax4 <- function(x) {
  z <- x - max(x)
  ex <- exp(z)
  ex / sum(ex)
}

# "Barrage / rejet" rule: rho[k] is a penalty if k is finalist
# Exemple : pénaliser les candidats très ED (3e composante de w)
rho_rule <- function(W, gamma_rejet_ED,gamma_rejet_EG) {
  # ED weight is column 3
  rho <- gamma_rejet_ED * W[,3] + gamma_rejet_EG * W[,1]
  rho
}

build_M_second_round <- function(W, A, B,
                                 beta = 7,
                                 alpha_abst = -0.4, kappa_abst = 3.0,
                                 alpha_bn   = -2.2, kappa_bn   = 1.2,
                                 rho = rep(0, nrow(W)),
                                 lambda_cos = 3) {
  K <- nrow(W)
  M <- matrix(NA_real_, K, 4)
  colnames(M) <- c("A","B","abst","bn")
  
  for (s in 1:K) {
    simA <- cos_sim(W[s,], W[A,])^lambda_cos
    simB <- cos_sim(W[s,], W[B,])^lambda_cos
    dist_to_duel <- 1 - max(simA, simB)
    
    lA    <- beta * simA - rho[A]
    lB    <- beta * simB - rho[B]
    lAbst <- alpha_abst + kappa_abst * dist_to_duel
    lBN   <- alpha_bn   + kappa_bn   * dist_to_duel
    
    M[s,] <- softmax4(c(lA, lB, lAbst, lBN))
  }
  M
}

simulate_second_round <- function(v1, W,
                                  beta = 7,
                                  alpha_abst = -0.4, kappa_abst = 3.0,
                                  alpha_bn   = -2.2, kappa_bn   = 1.2,
                                  gamma_rejet_ED = 4,
                                  gamma_rejet_EG = 0,
                                  lambda_cos = 3) {
  ord <- order(v1, decreasing = TRUE)
  A <- ord[1]; B <- ord[2]
  
  rho <- rho_rule(W, gamma_rejet_ED,gamma_rejet_EG)
  M <- build_M_second_round(W, A, B,
                            beta=beta,
                            alpha_abst=alpha_abst, kappa_abst=kappa_abst,
                            alpha_bn=alpha_bn, kappa_bn=kappa_bn,
                            rho=rho,
                            lambda_cos=lambda_cos)
  
  V2_ins <- as.numeric(t(v1) %*% M)  # (A,B,abst,bn) on "inscrits" scale
  expr <- V2_ins[1] + V2_ins[2]
  V2_expr <- c(A = V2_ins[1]/expr, B = V2_ins[2]/expr)
  
  list(A=A, B=B, V2_ins=V2_ins, V2_expr=V2_expr, M=M)
}

# ============================================================
# MONTE CARLO PIPELINE
# ============================================================

S <- 200

# storage
v1_mat <- matrix(NA_real_, S, K)
A_id <- integer(S)
B_id <- integer(S)

# second-round (expressed) shares for the two finalists in each simulation
pA_expr <- numeric(S)
pB_expr <- numeric(S)

# second-round (inscrits) shares for A/B/abst/bn
V2_ins <- matrix(NA_real_, S, 4)

for (s in 1:S) {
  v_obs <- simulate_one()$v_obs
  v1 <- v_obs[T,]
  v1_mat[s,] <- v1
  
  out2 <- simulate_second_round(v1, W,
                                beta = 7,
                                alpha_abst = -1.8144596, kappa_abst = 0.1,
                                alpha_bn   = -1.8144596, kappa_bn   = 0.1,
                                gamma_rejet_ED = 3.5541198,
                                #gamma_rejet_EG = 0.1923808 ,
                                gamma_rejet_EG = 0.6 ,
                                lambda_cos = 3)
  
  A_id[s] <- out2$A
  B_id[s] <- out2$B
  
  pA_expr[s] <- out2$V2_expr["A"]
  pB_expr[s] <- out2$V2_expr["B"]
  
  V2_ins[s,] <- out2$V2_ins
}

colnames(V2_ins) <- c("A","B","abst","bn")

# ============================================================
# PROBABILITIES & SUMMARIES
# ============================================================

# 1) Probabilities of qualifying to 2nd round
qualif_prob <- numeric(K)
for (k in 1:K) qualif_prob[k] <- mean(A_id == k | B_id == k)

# 2) Probabilities of each duel (unordered pair)
pair_key <- function(a,b) paste(sort(c(a,b)), collapse="-")
duel_keys <- vapply(1:S, function(i) pair_key(A_id[i], B_id[i]), character(1))
duel_tab <- sort(table(duel_keys)/S, decreasing=TRUE)

# 3) Probabilities of winning by candidate (marginalized over duels)
win_prob <- numeric(K)
for (i in 1:S) {
  a <- A_id[i]; b <- B_id[i]
  # winner in this sim
  if (pA_expr[i] > 0.5) {
    win_prob[a] <- win_prob[a] + 1
  } else {
    win_prob[b] <- win_prob[b] + 1
  }
}
win_prob <- win_prob / S

# 4) 75% intervals for second-round expressed share of winner (and margin)
winner_share <- numeric(S)
winner_id <- integer(S)
for (i in 1:S) {
  if (pA_expr[i] > 0.5) {
    winner_share[i] <- pA_expr[i]
    winner_id[i] <- A_id[i]
  } else {
    winner_share[i] <- pB_expr[i]
    winner_id[i] <- B_id[i]
  }
}
winner_margin <- winner_share - 0.5

IC75 <- function(x) quantile(x, c(0.125, 0.5, 0.875), na.rm=TRUE)

# 5) 75% intervals for turnout proxy (1 - abst) on inscrits, and bn
turnout <- 1 - V2_ins[, "abst"]
bn_rate <- V2_ins[, "bn"]

# ============================================================
# PRINT RESULTS
# ============================================================

cat("\n--- Probabilités de qualification au 2e tour ---\n")
print(round(qualif_prob, 3))

cat("\n--- Probabilités de victoire (marginalisées sur les duels) ---\n")
print(round(win_prob, 3))

cat("\n--- Duels les plus probables (top 10) ---\n")
print(round(head(duel_tab, 10), 3))

cat("\n--- Part du vainqueur au 2e tour (exprimés) : IC 75% ---\n")
print(IC75(winner_share))

cat("\n--- Marge du vainqueur (exprimés, vainqueur - 50%) : IC 75% ---\n")
print(IC75(winner_margin))

cat("\n--- Participation (1 - abstention, sur inscrits) : IC 75% ---\n")
print(IC75(turnout))

cat("\n--- Blanc/nul (sur inscrits) : IC 75% ---\n")
print(IC75(bn_rate))

# ============================================================
# OPTIONAL: plot histogram of winner ids and win probabilities
# ============================================================
X11()
op <- par(no.readonly=TRUE)
par(mfrow=c(1,2), mar=c(4,4,2,1))

barplot(qualif_prob, col=cols, main="P(qualification 2e tour)", ylab="Prob", names.arg=1:K, ylim = c(0,1))
barplot(win_prob, col=cols, main="P(victoire)", ylab="Prob", names.arg=1:K, ylim = c(0,1))

par(op)


