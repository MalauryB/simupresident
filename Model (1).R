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
  c(0.9, 0.0, 0.1),
  c(0.8, 0.2, 0.0),
  c(0.5, 0.5, 0.0),
  c(0.0, 1.0, 0.0),
  c(0.0, 0.3, 0.7),
  c(0.0, 0.0, 1.0),
  c(0.0, 0, 1)
)
K <- nrow(Ideo)
B <- ncol(Ideo)

# Dynamique : vecteur K
delta <-c(0.5,0, 0, -0.2, -0.5, 0.5, -0.5, 0)
#delta <-c(0,0, 0, 0, 0, 0, 0, 0)

# Conditions initiales (parts jour 1)
v0 <- c(0.11, 0.03, 0.08, 0.12, 0.16, 0.1, 0.36, 0.04)
#v0 <- c(0.36, 0.01, 0.3, 0.01, 0.01, 0.02, 0.22, 0.07)
stopifnot(length(v0) == K, abs(sum(v0) - 1) < 1e-12)

# Couleurs
cols <- c("red","darkred", "darkgreen", "pink", "yellow", "blue", "darkblue", "black")

# ----------------------------
# 2) Hyperparamètres regroupés
# ----------------------------
parms <- list(
  T = 365,
  # vote utile
  vote_utile = list(
    days_on = 10,      # activation sur les 'days_on' derniers jours
    s_tau   = 7,      # pente logistique
    lambda_cos = 5,    # concentration vers proches (W^lambda)
    beta_utile  = 10,    # poids vote utile
    sig_q = 0.05,
    sig_r = 0.01,
    r_min = 0.5,      # retention min (proportion d'electeurs qui reste fidèle quoi qu'il arrive)
    r_max = 0.9     # retention max (proportion d'electeurs qui reste fidèle dans le meilleure scénario)
  ),
  # dynamique
  dyn = list(
    sigma_f = c(0.01368569),  # facteur choc (estimé avec la presidentielle 2022)
    sigma_eps = rep(0.01910283 , K) # idiosyncratique (estimé avec la presidentielle 2022)
  ),
  # drift
  drift = list(
    lambda_drift = 5,
    positive_only = TRUE,
    eps = 1e-12
  ),
  # Second tour
  sec_t = list(
    alpha_nonexpr = -2.259515,
    rejet_D = 4.909898,
    rejet_G = 2.240084
  ),
  # Monte Carlo
  mc = list(
    S = 200,
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
# 6) Vote utile vectorisé
# ----------------------------
vote_utile_transform_vec2 <- function(
    v, W, delta,
    # v_ref = parts SANS vote utile (ex: au temps T-days_on)
    v_ref,
    lambda_cos = 6,
    beta_utile = 10,
    sig_q = 0.05,
    sig_r = 0.01, 
    r_min = 0, r_max = 1.00
) {
  K <- length(v)
  stopifnot(nrow(W) == K, length(v_ref) == K)
  
  if (is.null(delta)) delta <- rep(0, K)
  stopifnot(length(delta) == K)
  
  # 1) seuil endogène
  q0 <- sort(v_ref,decreasing = TRUE)[2]
  q0 <- pmax(q0, 1e-12)  # sécurité
  
  # "Enjeu" (gaussienne) : plus grand près de q0
  enjeu <- exp(-0.5 * ((v - q0) / sig_q)^2)
  enjeu <- enjeu/sum(enjeu) 
  # 2) rétention décroissante (logistique)
  b <- qlogis(0.05)  
  r <- plogis(((q0 - v) / sig_r) + b)
  
  r <- r_max - (r_max - r_min) * r
  r <- pmin(pmax(r, 0), 1)
  
  m <- (1 - r) * v
  v_keep <- r * v
  
  # Similarité / noyau
  Kern <- pmax(W, 0)^lambda_cos
  
  # attractivité des receveurs.
  att <- exp(beta_utile*enjeu + 5*delta*enjeu)  # taille K
  att <- att/sum(att)
  
  Scores <- Kern * rep(att, each = K)
  
  denom <- rowSums(Scores)
  bad <- denom <= 0
  if (any(bad)) {
    Scores[bad, ] <- 1
    denom[bad] <- K
  }
  A <- Scores / denom  # normalisation par ligne
  
  v_new <- v_keep + as.numeric(crossprod(A, m))
  
  v_new <- pmax(v_new, 0)
  v_new <- v_new / sum(v_new)
  
  # utile pour debug / traçage
  v_new
}

# ----------------------------
# 7) Une simulation (trajectoires T x K)
# ----------------------------
simulate_one <- function(Ideo, W, v0, delta, parms) {
  K <- length(v0); B <- ncol(Ideo); T <- parms$T
  
  Qf <- diag(parms$dyn$sigma_f^2, B)
  D  <- diag(parms$dyn$sigma_eps^2, K)
  
  v_base <- matrix(NA_real_, T, K)
  v_obs  <- matrix(NA_real_, T, K)
  
  # logits relatifs à baseline (candidat K)
  eta <- matrix(NA_real_, T, K - 1)
  eta[1, ] <- log(v0[1:(K-1)] / v0[K])
  
  v_base[1, ] <- softmax(c(eta[1, ], 0))
  v_obs[1, ]  <- v_base[1, ]
  
  # Date de référence pour q0 endogène (T - days_on)
  t0 <- max(1, T - parms$vote_utile$days_on)
  
  for (t in 2:T) {
    nu  <- as.numeric(mvrnorm(1, mu = rep(0, B), Sigma = Qf))
    eps <- as.numeric(mvrnorm(1, mu = rep(0, K), Sigma = D))
    
    u <- as.numeric(Ideo %*% nu) + eps
    u <- apply_drift_vec(
      u, W, delta,
      lambda_drift = parms$drift$lambda_drift,
      positive_only = parms$drift$positive_only,
      eps = parms$drift$eps
    )
    
    # innovation relative
    u_rel <- u[1:(K-1)] - u[K]
    
    eta[t, ] <- eta[t-1, ] + u_rel
    v_base[t, ] <- softmax(c(eta[t, ], 0))
  }
  
  for(t in 2:T){
    # activation progressive
    a_t <- activation_fun(
      t, T,
      days_on = parms$vote_utile$days_on,
      s_tau   = parms$vote_utile$s_tau
    )
    
    # Vote utile (nouveau) :
    v_ref <- v_base[t0, ]
    
    v_tilde <- vote_utile_transform_vec2(
      v_base[t, ], W, delta,
      v_ref = v_ref,
      lambda_cos = parms$vote_utile$lambda_cos,
      beta_utile = parms$vote_utile$beta_utile,
      sig_q = parms$vote_utile$sig_q,
      sig_r = parms$vote_utile$sig_r,
      r_min = parms$vote_utile$r_min,
      r_max = parms$vote_utile$r_max
    )
    
    v_obs[t, ] <- (1 - a_t) * v_base[t, ] + a_t * v_tilde
    v_obs[t, ] <- v_obs[t, ] / sum(v_obs[t, ])
  }
  
  list(v_base = v_base, v_obs = v_obs, t0 = t0)
}

# ----------------------------
# 8) Monte Carlo propre
# ----------------------------
S <- parms$mc$S
vobs_arr <- array(NA_real_, dim = c(S, T, K))

for (s in 1:S) {
  vobs_arr[s, , ] <- simulate_one(Ideo, W, v0, delta, parms)$v_obs
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

# Softmax for 3 outcomes
softmax3 <- function(x) {
  z <- x - max(x)
  ex <- exp(z)
  ex / sum(ex)
}

# règle rho
rho_rule <- function(Ideo, rejet_D, rejet_G) {
  rejet_D * Ideo[,3] + rejet_G * Ideo[,1]
}

# Build M with 3 columns: A, B, nonexpr
build_M_second_round3 <- function(W, A, B,
                                  beta = 7,
                                  alpha_nonexpr = -1.8,
                                  rho = rep(0, nrow(W)),
                                  lambda_cos = 3) {
  K <- nrow(W)
  M <- matrix(NA_real_, K, 3)
  colnames(M) <- c("A","B","nonexpr")
  
  for (s in 1:K) {
    # Similarités (non négatives, cohérentes avec ton kernel 1er tour)
    simA <- pmax(W[s, A], 0)^lambda_cos
    simB <- pmax(W[s, B], 0)^lambda_cos
    
    dist_to_duel <- 1 - max(simA, simB)
    duel_ext <- 0.5 * (rho[A] + rho[B])
    # Utilités
    lA      <- beta * simA - rho[A]
    lB      <- beta * simB - rho[B]
    lNonExp <- alpha_nonexpr
    
    M[s, ] <- softmax3(c(lA, lB, lNonExp))
  }
  M
}

simulate_second_round3 <- function(v1, Ideo, W,
                                   beta = 7,
                                   alpha_nonexpr = -2, 
                                   rejet_D = 5,
                                   rejet_G = 2,
                                   lambda_cos = 3) {
  ord <- order(v1, decreasing = TRUE)
  A <- ord[1]; B <- ord[2]
  
  rho <- rho_rule(Ideo, rejet_D, rejet_G)
  
  M <- build_M_second_round3(W, A, B,
                             beta = beta,
                             alpha_nonexpr = alpha_nonexpr,
                             rho = rho,
                             lambda_cos = lambda_cos)
  
  V2_ins <- as.numeric(t(v1) %*% M)  # (A,B,nonexpr) sur inscrits
  expr <- V2_ins[1] + V2_ins[2]
  V2_expr <- c(A = V2_ins[1]/expr, B = V2_ins[2]/expr)
  
  list(A = A, B = B, V2_ins = V2_ins, V2_expr = V2_expr, M = M)
}

# ============================================================
# MONTE CARLO PIPELINE
# ============================================================

v1_mat <- matrix(NA_real_, S, K)
A_id <- integer(S)
B_id <- integer(S)

pA_expr <- numeric(S)
pB_expr <- numeric(S)

V2_ins <- matrix(NA_real_, S, 3)

for (s in 1:S) {
  v1 <- vobs_arr[s, T, ]
  v1_mat[s, ] <- v1
  
  out2 <- simulate_second_round3(
    v1, Ideo, W,
    beta = 7,
    alpha_nonexpr = parms$sec_t$alpha_nonexpr,
    rejet_D = parms$sec_t$rejet_D,
    rejet_G = parms$sec_t$rejet_G,
    lambda_cos = 3
  )
  
  A_id[s] <- out2$A
  B_id[s] <- out2$B
  
  pA_expr[s] <- out2$V2_expr["A"]
  pB_expr[s] <- out2$V2_expr["B"]
  
  V2_ins[s, ] <- out2$V2_ins
}

colnames(V2_ins) <- c("A","B","nonexpr")

# ============================================================
# PROBABILITIES & SUMMARIES (3 outcomes)
# ============================================================

qualif_prob <- numeric(K)
for (k in 1:K) qualif_prob[k] <- mean(A_id == k | B_id == k)

pair_key <- function(a,b) paste(sort(c(a,b)), collapse="-")
duel_keys <- vapply(1:S, function(i) pair_key(A_id[i], B_id[i]), character(1))
duel_tab <- sort(table(duel_keys)/S, decreasing = TRUE)

win_prob <- numeric(K)
for (i in 1:S) {
  a <- A_id[i]; b <- B_id[i]
  if (pA_expr[i] > 0.5) win_prob[a] <- win_prob[a] + 1 else win_prob[b] <- win_prob[b] + 1
}
win_prob <- win_prob / S

winner_share <- numeric(S)
winner_id <- integer(S)
for (i in 1:S) {
  if (pA_expr[i] > 0.5) { winner_share[i] <- pA_expr[i]; winner_id[i] <- A_id[i] }
  else                  { winner_share[i] <- pB_expr[i]; winner_id[i] <- B_id[i] }
}
winner_margin <- winner_share - 0.5

IC75 <- function(x) quantile(x, c(0.125, 0.5, 0.875), na.rm = TRUE)

# Turnout proxy now = 1 - nonexpr
turnout <- 1 - V2_ins[, "nonexpr"]

cat("\n--- Participation (1 - non-exprimés, sur inscrits) : IC 75% ---\n")
print(IC75(turnout))

# ============================================================
# OPTIONAL: plot histogram of winner ids and win probabilities
# ============================================================
X11()
op <- par(no.readonly=TRUE)
par(mfrow=c(1,2), mar=c(4,4,2,1))

barplot(qualif_prob, col=cols, main="P(qualification 2e tour)", ylab="Prob", names.arg=1:K, ylim = c(0,1))
barplot(win_prob, col=cols, main="P(victoire)", ylab="Prob", names.arg=1:K, ylim = c(0,1))

par(op)

