# ============================================================
# Modèle 1er tour (Monte Carlo) — aligné sur Note technique
# - Latent sur logits relatifs (baseline = candidat K)
# - Choc u_t = Ideo %*% nu_t + eps_t + drift(u_t)
# - Vote utile 2-pass : trajectoires de base, puis VU avec
#   seuil endogène q0 = v_(2)(t0)
# - Rétention logistique (§5.4)
# - Attractivité : exp((5*delta_k + beta)*e_k)
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

plogis_fn <- function(x) 1 / (1 + exp(-x))
qlogis_fn <- function(p) log(p / (1 - p))

cosine_sim <- function(Ideo, eps = 1e-12) {
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
delta <- c(0.2, 0, 0, -0.5, 0, -0.2, 0)

# Conditions initiales (parts jour 1)
v0 <- c(0.12, 0.09, 0.135, 0.17, 0.08, 0.35, 0.055)
stopifnot(length(v0) == K, abs(sum(v0) - 1) < 1e-12)

# Couleurs
cols <- c("red", "darkgreen", "pink", "yellow", "blue", "darkblue", "black")

# ----------------------------
# 2) Hyperparamètres (Note technique)
# ----------------------------
parms <- list(
  T = 365,
  # vote utile : activation
  vote_utile = list(
    days_on    = 10,     # activation sur les 'days_on' derniers jours
    s_tau      = 7,      # pente logistique temporelle
    lambda_cos = 5,      # concentration vers proches (W^lambda)
    beta_utile = 10,     # poids attractivité (= β dans la Note)
    sig_q      = 0.05,   # largeur enjeu gaussien
    sig_r      = 0.01,   # pente rétention logistique
    r_min      = 0.50,   # rétention min
    r_max      = 0.90    # rétention max
  ),
  # dynamique
  dyn = list(
    sigma_f   = 1.368569e-02,          # facteur choc (Note technique)
    sigma_eps = rep(1.910283e-02, K)    # idiosyncratique (Note technique)
  ),
  # drift
  drift = list(
    lambda_drift  = 5,
    drift_scale   = 1e-3,
    positive_only = TRUE,
    eps           = 1e-12
  ),
  # Second tour
  sec_t = list(
    alpha_nonexpr = -2.259515,
    rejet_D       = 4.909898,
    rejet_G       = 2.240084
  ),
  # Monte Carlo
  mc = list(
    S     = 500,
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
# 4) Activation temporelle vote utile
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
apply_drift_vec <- function(u, W, delta, lambda_drift = 5,
                            positive_only = TRUE, eps = 1e-12) {
  K <- length(u)
  stopifnot(nrow(W) == K, length(delta) == K)

  delta_sc <- 1e-3 * delta
  delta0 <- delta_sc - mean(delta_sc)

  S <- W
  if (positive_only) S <- pmax(S, 0)
  diag(S) <- 0

  S <- S^lambda_drift
  den <- rowSums(S)

  bad <- den < eps
  if (any(bad)) {
    S[bad, ] <- 1
    diag(S)[bad] <- 0
    den[bad] <- rowSums(S[bad, , drop = FALSE])
  }

  S <- S / den

  comp <- as.numeric(crossprod(S, -delta0))

  u + (delta0 + comp)
}

# ----------------------------
# 6) Vote utile — Note technique §5.3-5.4
#    Seuil endogène, rétention logistique,
#    attractivité exp((5*delta_k + beta)*e_k)
# ----------------------------
vote_utile_transform_vec <- function(v, W, delta,
                                     v_ref,
                                     lambda_cos = 5,
                                     beta_utile = 10,
                                     sig_q = 0.05,
                                     sig_r = 0.01,
                                     r_min = 0.50,
                                     r_max = 0.90) {
  K <- length(v)
  stopifnot(nrow(W) == K, length(delta) == K)

  # 1) Seuil endogène : 2ème plus haut score de v_ref
  q0 <- max(sort(v_ref, decreasing = TRUE)[2], 1e-12)

  # 2) Enjeu gaussien (pas de normalisation — §5.3)
  enjeu <- exp(-0.5 * ((v - q0) / sig_q)^2)

  # 3) Rétention logistique (§5.4)
  b <- qlogis_fn(0.05)
  raw <- plogis_fn((q0 - v) / sig_r + b)
  r <- pmin(pmax(r_max - (r_max - r_min) * raw, 0), 1)

  m <- (1 - r) * v       # masse à redistribuer
  v_keep <- r * v

  # 4) Noyau de proximité
  Kern <- pmax(W, 0)^lambda_cos

  # 5) Attractivité : exp((5*delta_k + beta_utile) * enjeu_k)
  att_raw <- exp(beta_utile * enjeu + 5 * delta * enjeu)
  att_sum <- sum(att_raw)
  att <- if (att_sum > 0) att_raw / att_sum else rep(1 / K, K)

  # 6) Scores_{j,k} = Kern_{j,k} * att_k, normalisé par ligne
  Scores <- Kern * rep(att, each = K)
  denom <- rowSums(Scores)
  bad <- denom <= 0
  if (any(bad)) {
    Scores[bad, ] <- 1
    denom[bad] <- K
  }
  A <- Scores / denom

  # 7) v_new = v_keep + t(A) %*% m
  v_new <- v_keep + as.numeric(crossprod(A, m))

  v_new <- pmax(v_new, 0)
  v_new / sum(v_new)
}

# ----------------------------
# 7) Une simulation — 2-pass (Note technique)
#    Pass 1 : trajectoires de base (sans VU)
#    Pass 2 : application du vote utile
# ----------------------------
simulate_one <- function(Ideo, W, v0, delta, parms) {
  K <- length(v0); B <- ncol(Ideo); T <- parms$T

  Qf <- diag(parms$dyn$sigma_f^2, B)
  D  <- diag(parms$dyn$sigma_eps^2, K)

  v_base <- matrix(NA_real_, T, K)

  # logits relatifs à baseline (candidat K)
  eta <- matrix(NA_real_, T, K - 1)
  eta[1, ] <- log(v0[1:(K-1)] / v0[K])

  v_base[1, ] <- softmax(c(eta[1, ], 0))

  # === PASS 1 : trajectoires de base (sans vote utile) ===
  for (t in 2:T) {
    nu  <- as.numeric(mvrnorm(1, mu = rep(0, B), Sigma = Qf))
    eps <- as.numeric(mvrnorm(1, mu = rep(0, K), Sigma = D))

    u <- as.numeric(Ideo %*% nu) + eps
    u <- apply_drift_vec(u, W, delta,
                         lambda_drift = parms$drift$lambda_drift,
                         positive_only = parms$drift$positive_only,
                         eps = parms$drift$eps)

    u_rel <- u[1:(K-1)] - u[K]

    eta[t, ] <- eta[t-1, ] + u_rel
    v_base[t, ] <- softmax(c(eta[t, ], 0))
  }

  # === PASS 2 : application du vote utile ===
  t0 <- max(1, T - parms$vote_utile$days_on)
  v_ref <- v_base[t0, ]
  T0 <- T - parms$vote_utile$days_on
  tau0 <- T - T0

  v_obs <- matrix(NA_real_, T, K)
  v_obs[1, ] <- v_base[1, ]

  for (t in 2:T) {
    tau_t <- T - t
    a_t <- 1 / (1 + exp((tau_t - tau0) / parms$vote_utile$s_tau))

    v_tilde <- vote_utile_transform_vec(
      v_base[t, ], W, delta,
      v_ref      = v_ref,
      lambda_cos = parms$vote_utile$lambda_cos,
      beta_utile = parms$vote_utile$beta_utile,
      sig_q      = parms$vote_utile$sig_q,
      sig_r      = parms$vote_utile$sig_r,
      r_min      = parms$vote_utile$r_min,
      r_max      = parms$vote_utile$r_max
    )

    v_obs[t, ] <- (1 - a_t) * v_base[t, ] + a_t * v_tilde
    v_obs[t, ] <- v_obs[t, ] / sum(v_obs[t, ])
  }

  list(v_base = v_base, v_obs = v_obs)
}

# ----------------------------
# 8) Monte Carlo
# ----------------------------
S <- parms$mc$S
vobs_arr <- array(NA_real_, dim = c(S, T, K))

for (s in 1:S) {
  vobs_arr[s, , ] <- simulate_one(Ideo, W, v0, delta, parms)$v_obs
}

# Stats : quantiles
probs <- parms$mc$probs
q_arr <- apply(vobs_arr, c(2, 3), quantile, probs = probs, na.rm = TRUE)
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

for (k in 1:K) {
  polygon(c(t_seq, rev(t_seq)),
          c(lo_v[, k], rev(hi_v[, k])),
          col = adjustcolor(cols[k], alpha.f = 0.18),
          border = NA)
}

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

softmax3 <- function(x) {
  z <- x - max(x)
  ex <- exp(z)
  ex / sum(ex)
}

rho_rule <- function(Ideo, rejet_D, rejet_G) {
  rejet_D * Ideo[,3] + rejet_G * Ideo[,1]
}

build_M_second_round3 <- function(W, A, B,
                                  beta = 7,
                                  alpha_nonexpr = -1.8,
                                  rho = rep(0, nrow(W)),
                                  lambda_cos = 3) {
  K <- nrow(W)
  M <- matrix(NA_real_, K, 3)
  colnames(M) <- c("A","B","nonexpr")

  for (s in 1:K) {
    simA <- pmax(W[s, A], 0)^lambda_cos
    simB <- pmax(W[s, B], 0)^lambda_cos

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

  V2_ins <- as.numeric(t(v1) %*% M)
  expr <- V2_ins[1] + V2_ins[2]
  V2_expr <- c(A = V2_ins[1]/expr, B = V2_ins[2]/expr)

  list(A = A, B = B, V2_ins = V2_ins, V2_expr = V2_expr, M = M)
}

# ============================================================
# MONTE CARLO PIPELINE — SECOND TOUR
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
# PROBABILITIES & SUMMARIES
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
  else                   { winner_share[i] <- pB_expr[i]; winner_id[i] <- B_id[i] }
}
winner_margin <- winner_share - 0.5

IC75 <- function(x) quantile(x, c(0.125, 0.5, 0.875), na.rm = TRUE)

turnout <- 1 - V2_ins[, "nonexpr"]

cat("\n--- Participation (1 - non-exprimés, sur inscrits) : IC 75% ---\n")
print(IC75(turnout))

# ============================================================
# PLOTS
# ============================================================
X11()
op <- par(no.readonly=TRUE)
par(mfrow=c(1,2), mar=c(4,4,2,1))

barplot(qualif_prob, col=cols, main="P(qualification 2e tour)", ylab="Prob", names.arg=1:K, ylim = c(0,1))
barplot(win_prob, col=cols, main="P(victoire)", ylab="Prob", names.arg=1:K, ylim = c(0,1))

par(op)
