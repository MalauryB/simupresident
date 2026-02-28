-- ============================================
-- SimuPresident - Schéma de base de données
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Partis politiques
CREATE TABLE parti (
  tag VARCHAR PRIMARY KEY,
  nom VARCHAR NOT NULL,
  actif BOOLEAN DEFAULT true,
  couleur_fond VARCHAR,
  couleur_texte VARCHAR,
  couleur_accent VARCHAR,
  couleur_graphique VARCHAR
);

-- 2. Candidats (variantes par parti)
CREATE TABLE candidat (
  id VARCHAR PRIMARY KEY,
  parti_tag VARCHAR NOT NULL REFERENCES parti(tag) ON DELETE CASCADE,
  indice_variante INT NOT NULL DEFAULT 0,
  nom VARCHAR NOT NULL,
  initiales VARCHAR,
  sonde_individuellement BOOLEAN DEFAULT false,
  groupe_sondage VARCHAR,
  attractivite FLOAT DEFAULT 0,
  tendance FLOAT DEFAULT 0,
  ideologie_gauche FLOAT DEFAULT 0,
  ideologie_centre FLOAT DEFAULT 0,
  ideologie_droite FLOAT DEFAULT 0,
  taux_barrage FLOAT DEFAULT 0,
  start_agrege FLOAT DEFAULT 0,
  start_debiaise FLOAT DEFAULT 0,
  start_personnalise FLOAT DEFAULT 0,
  photo_url VARCHAR,
  UNIQUE (parti_tag, indice_variante)
);

-- 3. Sources de sondage
CREATE TABLE source_sondage (
  type VARCHAR PRIMARY KEY,
  libelle VARCHAR NOT NULL,
  description VARCHAR,
  icone VARCHAR
);

-- 4. Simulations
CREATE TABLE simulation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_sondage_type VARCHAR NOT NULL REFERENCES source_sondage(type) ON DELETE RESTRICT,
  date_creation TIMESTAMPTZ DEFAULT now(),
  nb_simulations INT NOT NULL DEFAULT 1000,
  nb_jours INT NOT NULL DEFAULT 30,
  niveau_confiance FLOAT NOT NULL DEFAULT 0.75
);

-- 5. Configuration candidat par simulation
CREATE TABLE config_simulation_candidat (
  simulation_id UUID NOT NULL REFERENCES simulation(id) ON DELETE CASCADE,
  parti_tag VARCHAR NOT NULL REFERENCES parti(tag) ON DELETE CASCADE,
  indice_variante INT NOT NULL DEFAULT 0,
  point_depart FLOAT DEFAULT 0,
  attractivite FLOAT DEFAULT 0,
  tendance FLOAT DEFAULT 0,
  taux_barrage FLOAT DEFAULT 0,
  ideologie_g FLOAT DEFAULT 0,
  ideologie_c FLOAT DEFAULT 0,
  ideologie_d FLOAT DEFAULT 0,
  PRIMARY KEY (simulation_id, parti_tag)
);

-- 6. Résultats candidat par simulation
CREATE TABLE resultat_candidat (
  simulation_id UUID NOT NULL REFERENCES simulation(id) ON DELETE CASCADE,
  parti_tag VARCHAR NOT NULL REFERENCES parti(tag) ON DELETE CASCADE,
  p_qualification_2nd_tour FLOAT DEFAULT 0,
  p_victoire FLOAT DEFAULT 0,
  valeur_finale_moyenne FLOAT DEFAULT 0,
  PRIMARY KEY (simulation_id, parti_tag)
);

-- 7. Trajectoires (séries temporelles)
CREATE TABLE trajectoire (
  simulation_id UUID NOT NULL REFERENCES simulation(id) ON DELETE CASCADE,
  parti_tag VARCHAR NOT NULL REFERENCES parti(tag) ON DELETE CASCADE,
  jour INT NOT NULL,
  valeur_moyenne FLOAT DEFAULT 0,
  borne_haute_ic75 FLOAT DEFAULT 0,
  borne_basse_ic75 FLOAT DEFAULT 0,
  PRIMARY KEY (simulation_id, parti_tag, jour)
);

-- ============================================
-- Index pour les performances
-- ============================================

CREATE INDEX idx_candidat_parti ON candidat(parti_tag);
CREATE INDEX idx_simulation_source ON simulation(source_sondage_type);
CREATE INDEX idx_simulation_date ON simulation(date_creation DESC);
CREATE INDEX idx_config_simulation ON config_simulation_candidat(simulation_id);
CREATE INDEX idx_resultat_simulation ON resultat_candidat(simulation_id);
CREATE INDEX idx_trajectoire_simulation ON trajectoire(simulation_id);
CREATE INDEX idx_trajectoire_parti ON trajectoire(parti_tag);

-- ============================================
-- Row Level Security (RLS)
-- Lecture publique, écriture publique (pas d'auth pour l'instant)
-- ============================================

ALTER TABLE parti ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidat ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_sondage ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_simulation_candidat ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultat_candidat ENABLE ROW LEVEL SECURITY;
ALTER TABLE trajectoire ENABLE ROW LEVEL SECURITY;

-- Policies : accès complet via anon key (à restreindre plus tard avec auth)
CREATE POLICY "Accès public en lecture" ON parti FOR SELECT USING (true);
CREATE POLICY "Accès public en écriture" ON parti FOR ALL USING (true);

CREATE POLICY "Accès public en lecture" ON candidat FOR SELECT USING (true);
CREATE POLICY "Accès public en écriture" ON candidat FOR ALL USING (true);

CREATE POLICY "Accès public en lecture" ON source_sondage FOR SELECT USING (true);
CREATE POLICY "Accès public en écriture" ON source_sondage FOR ALL USING (true);

CREATE POLICY "Accès public en lecture" ON simulation FOR SELECT USING (true);
CREATE POLICY "Accès public en écriture" ON simulation FOR ALL USING (true);

CREATE POLICY "Accès public en lecture" ON config_simulation_candidat FOR SELECT USING (true);
CREATE POLICY "Accès public en écriture" ON config_simulation_candidat FOR ALL USING (true);

CREATE POLICY "Accès public en lecture" ON resultat_candidat FOR SELECT USING (true);
CREATE POLICY "Accès public en écriture" ON resultat_candidat FOR ALL USING (true);

CREATE POLICY "Accès public en lecture" ON trajectoire FOR SELECT USING (true);
CREATE POLICY "Accès public en écriture" ON trajectoire FOR ALL USING (true);
