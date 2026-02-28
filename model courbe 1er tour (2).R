# ============================================================
# Modèle 1er tour (Monte Carlo)
# - Latent sur logits relatifs (baseline = candidat K)
# - Choc u_t = Ideo %*% nu_t + eps_t + drift(u_t)
# - Vote utile activé en fin : mix (1-a_t)*v + a_t*VU(v)
# - Sorties : médiane + IC (quantiles)
# ============================================================

rm(list = ls())
set.seed(123)
suppressPackageStartupMessages(library(MASS))

# ----------------------------
# Outils numériques
# ----------------------------
softmax <- function(x) {
  z <- x - max(x)
  ez <- exp(z)
  ez / sum(ez)
}

cosine_sim <- function(Ideo, eps = 1e-12) {
  # Normalisation lignes
  Wn <- Ideo / pmax(sqrt(rowSums(Ideo^2)), eps)
  W <- Wn %*% t(Wn)
  diag(W) <- 1
  W
}

# ----------------------------
# 1) Entrées (à fournir)
# ----------------------------
Ideo <- rbind(
  c(1.0, 0.0, 0.0),
  c(0.8, 0.2, 0.0),
  c(0.5, 0.5, 0.0),
  c(0.0, 1.0, 0.0),
  c(0.0, 0.3, 0.7),
  c(0.0, 0.0, 1.0),
  c(0.0, 0.0, 1.0)
)
K <- nrow(Ideo)
B <- ncol(Ideo)

# Tendance long terme (drift) : vecteur K
delta <-c(0, 0, 0, -0.5, 0, -0.2, 0)

# Focalisation vote utile : vecteur K
psi <- c(2, 0, 0.5, 0, 0, 0, 0)
psi <- psi - mean(psi)  # centrage conseillé

# Conditions initiales (parts jour 1)
v0 <- c(0.12, 0.09, 0.135, 0.17, 0.08, 0.35, 0.055)
stopifnot(length(v0) == K, abs(sum(v0) - 1) < 1e-12)

# Couleurs
cols <- c("red", "darkgreen", "pink", "yellow", "blue", "darkblue", "black")

# ----------------------------
# 2) Hyperparamètres regroupés
# ----------------------------
parms <- list(
  T = 365,
  # vote utile : activation
  vote_utile = list(
    days_on = 10,      # activation sur les 'days_on' derniers jours
    s_tau   = 5,      # pente logistique
    lambda_cos = 6,    # concentration vers proches (W^lambda)
    beta_viab  = 10,    # poids "viabilité"
    q0 = 0.15,         # niveau visé par "enjeu"
    sig_q = 0.10,
    r_min = 0.70,      # retention min
    r_max = 0.95,
    eps_viab = 1e-4
  ),
  # dynamique
  dyn = list(
    sigma_f = c(0.01, 0.005, 0.01),  # facteurs (taille B)
    sigma_eps = rep(0.01, K)        # idiosyncratique (taille K)
  ),
  # drift
  drift = list(
    lambda_drift = 6,
    positive_only = TRUE,
    eps = 1e-12
  ),
  # Monte Carlo
  mc = list(
    S = 100,
    probs = c(0.10, 0.50, 0.90)
  )
)

T <- parms$T
t_seq <- 1:T

# ----------------------------
# 3) Pré-calcul : matrice W
# ----------------------------
W <- cosine_sim(Ideo)

# ----------------------------
# 4) Fonctions : activation vote utile
# ----------------------------
activation_fun <- function(t, T, days_on, s_tau) {
  T0 <- T - days_on
  tau0 <- T - T0
  tau_t <- T - t
  1 / (1 + exp((tau_t - tau0) / s_tau))
}

# ----------------------------
# 5) Drift vectorisé
# ----------------------------
apply_drift_vec <- function(u, W, delta, lambda_drift = 6, positive_only = TRUE, eps = 1e-12) {
  K <- length(u)
  stopifnot(nrow(W) == K, length(delta) == K)
  
  delta <- 1e-3 * delta
  delta0 <- delta - mean(delta)
  
  S <- W
  if (positive_only) S <- pmax(S, 0)
  diag(S) <- 0
  
  S <- S^lambda_drift
  den <- rowSums(S)
  
  # lignes dégénérées -> distribution uniforme hors diagonale
  bad <- den < eps
  if (any(bad)) {
    S[bad, ] <- 1
    diag(S)[bad] <- 0
    den[bad] <- rowSums(S[bad, , drop = FALSE])
  }
  
  S <- S / den  # normalisation par ligne
  
  # comp_k = sum_i (-delta0_i) * S_{i,k}  -> t(S) %*% (-delta0)
  comp <- as.numeric(crossprod(S, -delta0))
  
  u + (delta0 + comp)
}

# ----------------------------
# 6) Vote utile vectorisé (utilise W déjà calculé)
# ----------------------------
vote_utile_transform_vec <- function(v, W, psi,
                                     lambda_cos = 6,
                                     beta_viab  = 3,
                                     q0 = 0.15, sig_q = 0.10,
                                     r_min = 0.70, r_max = 0.95,
                                     eps_viab = 1e-4) {
  K <- length(v)
  stopifnot(nrow(W) == K, length(psi) == K)
  
  # "Enjeu" (gaussienne) : plus grand près de q0
  enjeu <- exp(-0.5 * ((v - q0) / sig_q)^2)
  
  # retention r(v) = r_max - (r_max-r_min)*enjeu(v)
  r <- r_max - (r_max - r_min) * enjeu
  r <- pmin(pmax(r, 0), 1)
  
  m <- (1 - r) * v    # masse à redistribuer depuis chaque j
  v_keep <- r * v
  
  # Matrice de transition A_{j,k} ∝ (W_{j,k}^lambda) * att_k
  Kern <- pmax(W, 0)^lambda_cos
  
  att <- exp(4 * psi + beta_viab * log(enjeu + eps_viab))  # taille K
  
  # scores_{j,k} = Kern_{j,k} * att_k  (broadcast colonne)
  Scores <- Kern * rep(att, each = K)
  
  denom <- rowSums(Scores)
  bad <- denom <= 0
  if (any(bad)) {
    Scores[bad, ] <- 1
    denom[bad] <- K
  }
  A <- Scores / denom  # normalisation par ligne (j)
  
  # v_new = v_keep + t(A) %*% m
  v_new <- v_keep + as.numeric(crossprod(A, m))
  
  v_new <- pmax(v_new, 0)
  v_new / sum(v_new)
}

# ----------------------------
# 7) Une simulation (trajectoires T x K)
# ----------------------------
simulate_one <- function(Ideo, W, v0, delta, psi, parms) {
  K <- length(v0); B <- ncol(Ideo); T <- parms$T
  
  # Matrices de bruit
  Qf <- diag(parms$dyn$sigma_f^2, B)
  D  <- diag(parms$dyn$sigma_eps^2, K)
  
  
  # Stockage
  v_base <- matrix(NA_real_, T, K)
  v_obs  <- matrix(NA_real_, T, K)
  
  # logits relatifs à baseline (candidat K)
  eta <- matrix(NA_real_, T, K - 1)
  eta[1, ] <- log(v0[1:(K-1)] / v0[K])
  
  v_base[1, ] <- softmax(c(eta[1, ], 0))
  v_obs[1, ]  <- v_base[1, ]
  
  # boucle temps
  for (t in 2:T) {
    nu  <- as.numeric(mvrnorm(1, mu = rep(0, B), Sigma = Qf))
    eps <- as.numeric(mvrnorm(1, mu = rep(0, K), Sigma = D))
    
    u <- as.numeric(Ideo %*% nu) + eps
    u <- apply_drift_vec(u, W, delta,
                         lambda_drift = parms$drift$lambda_drift,
                         positive_only = parms$drift$positive_only,
                         eps = parms$drift$eps)
    
    u_rel <- u[1:(K-1)]  # baseline fixe
    
    eta[t, ] <- eta[t-1, ] + u_rel
    
    v_base[t, ] <- softmax(c(eta[t, ], 0))
    
    a_t <- activation_fun(t, T,
                          days_on = parms$vote_utile$days_on,
                          s_tau   = parms$vote_utile$s_tau)
    
    v_tilde <- vote_utile_transform_vec(
      v_base[t, ], W, psi,
      lambda_cos = parms$vote_utile$lambda_cos,
      beta_viab  = parms$vote_utile$beta_viab,
      q0 = parms$vote_utile$q0, sig_q = parms$vote_utile$sig_q,
      r_min = parms$vote_utile$r_min, r_max = parms$vote_utile$r_max,
      eps_viab = parms$vote_utile$eps_viab
    )
    
    v_obs[t, ] <- (1 - a_t) * v_base[t, ] + a_t * v_tilde
    v_obs[t, ] <- v_obs[t, ] / sum(v_obs[t, ])
  }
  
  list(v_base = v_base, v_obs = v_obs)
}

# ----------------------------
# 8) Monte Carlo propre
# ----------------------------
S <- parms$mc$S
vobs_arr <- array(NA_real_, dim = c(S, T, K))

for (s in 1:S) {
  vobs_arr[s, , ] <- simulate_one(Ideo, W, v0, delta, psi, parms)$v_obs
}

# Stats : quantiles (vectorisé via apply)
probs <- parms$mc$probs
q_arr <- apply(vobs_arr, c(2, 3), quantile, probs = probs, na.rm = TRUE)
# q_arr dim = length(probs) x T x K
lo_v  <- q_arr[1, , ]
med_v <- q_arr[2, , ]
hi_v  <- q_arr[3, , ]

# ----------------------------
# 9) Plot global + bandes
# ----------------------------
T0 <- T - parms$vote_utile$days_on
ylim <- range(c(lo_v, hi_v), na.rm = TRUE)

X11()
op <- par(no.readonly = TRUE)
par(mfrow = c(1, 1), mar = c(4, 4, 2, 1))

plot(t_seq, med_v[, 1], type = "n",
     ylim = ylim, xlab = "Jour", ylab = "Part",
     main = sprintf("Monte Carlo (médiane + IC %.0f%%-%.0f%%)",
                    100*probs[1], 100*probs[3]))

# bandes
for (k in 1:K) {
  polygon(c(t_seq, rev(t_seq)),
          c(lo_v[, k], rev(hi_v[, k])),
          col = adjustcolor(cols[k], alpha.f = 0.18),
          border = NA)
}

# courbes médianes
matlines(t_seq, med_v, lty = 1, col = cols, lwd = 2)
abline(v = T0, lty = 2)

legend("topright",
       legend = paste("Candidat", 1:K),
       col = cols, lty = 1, lwd = 2, bty = "n", cex = 0.85)

par(op)

# ----------------------------
# 10) Export dataframe (optionnel)
# ----------------------------
activation_vec <- vapply(t_seq, activation_fun, numeric(1),
                         T = T,
                         days_on = parms$vote_utile$days_on,
                         s_tau   = parms$vote_utile$s_tau)

df <- data.frame(day = t_seq, activation = activation_vec)

for (k in 1:K) {
  df[[paste0("med_", k)]] <- med_v[, k]
  df[[paste0("lo_",  k)]] <- lo_v[, k]
  df[[paste0("hi_",  k)]] <- hi_v[, k]
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
rho_rule <- function(Ideo, gamma_rejet_ED,gamma_rejet_EG) {
  # ED weight is column 3
  rho <- gamma_rejet_ED * Ideo[,3] + gamma_rejet_EG * Ideo[,1]
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
    simA <- W[s,A]^lambda_cos
    simB <- W[s,B]^lambda_cos
    dist_to_duel <- 1 - max(simA, simB)
    
    lA    <- beta * simA - rho[A]
    lB    <- beta * simB - rho[B]
    lAbst <- alpha_abst + kappa_abst * dist_to_duel
    lBN   <- alpha_bn   + kappa_bn   * dist_to_duel
    
    M[s,] <- softmax4(c(lA, lB, lAbst, lBN))
  }
  M
}

simulate_second_round <- function(v1, Ideo, W,
                                  beta = 7,
                                  alpha_abst = -0.4, kappa_abst = 3.0,
                                  alpha_bn   = -2.2, kappa_bn   = 1.2,
                                  gamma_rejet_ED = 4,
                                  gamma_rejet_EG = 0,
                                  lambda_cos = 3) {
  ord <- order(v1, decreasing = TRUE)
  A <- ord[1]; B <- ord[2]
  
  rho <- rho_rule(Ideo, gamma_rejet_ED,gamma_rejet_EG)
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
  v1 <- vobs_arr[s,T,]
  v1_mat[s,] <- v1
  
  out2 <- simulate_second_round(v1,Ideo, W,
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

