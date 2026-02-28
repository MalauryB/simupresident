-- ============================================
-- SimuPresident - Données initiales (seed)
-- À exécuter dans Supabase APRÈS schema.sql
-- ============================================

-- 0. Nettoyage (candidats d'abord à cause de la FK vers parti)
DELETE FROM candidat;
DELETE FROM parti;
DELETE FROM source_sondage;

-- 1. Partis politiques (7 blocs)
INSERT INTO parti (tag, nom, actif, couleur_fond, couleur_texte, couleur_accent, couleur_graphique) VALUES
  ('LFI',  'La France Insoumise',         true, '#CC2443', '#FFFFFF', '#E63946', '#E63946'),
  ('EELV', 'EELV / Debout / L''Après',  true, '#00A86B', '#FFFFFF', '#008C57', '#00A86B'),
  ('PS',   'PS / Place Publique',        true, '#FF6B9D', '#FFFFFF', '#E0476E', '#FF6B9D'),
  ('REN',  'Renaissance / Horizons',     true, '#FFD600', '#1a1a1a', '#FFB800', '#FFB800'),
  ('LR',   'Les Républicains',       true, '#0066CC', '#FFFFFF', '#004A99', '#0066CC'),
  ('RN',   'Rassemblement National', true, '#1B2A4A', '#EEEDFF', '#002395', '#002395'),
  ('REC',  'Reconquête',             true, '#1a1a2e', '#FFFFFF', '#2D2D5E', '#2D2D5E');

-- 2. Candidats (variantes)
INSERT INTO candidat (id, parti_tag, indice_variante, nom, initiales, sonde_individuellement, groupe_sondage, attractivite, tendance, ideologie_gauche, ideologie_centre, ideologie_droite, taux_barrage, start_agrege, start_debiaise, start_personnalise, photo_url) VALUES
  -- LFI
  ('lfi-0',  'LFI',  0, 'Jean-Luc Mélenchon', 'JLM', true,  NULL,                       0.5,  0.35, 0.8,  0.15, 0.05, 0.35, 12, 13, 12, NULL),
  -- EELV
  ('eelv-0', 'EELV', 0, 'Marine Tondelier',   'MT',  false, 'Les Écologistes',           0.5,  0.55, 0.55, 0.4,  0.05, 0.1,   8,  9,  8, NULL),
  ('eelv-1', 'EELV', 1, 'François Ruffin',    'FR',  false, 'Debout',                    0.5,  0.45, 0.7,  0.25, 0.05, 0.12,  7,  7,  7, NULL),
  ('eelv-2', 'EELV', 2, 'Clémentine Autain',  'CA',  false, 'L''Après',                  0.35, 0.4,  0.68, 0.27, 0.05, 0.1,   5,  5,  5, NULL),
  -- PS
  ('ps-0',   'PS',   0, 'Raphaël Glucksmann', 'RG',  true,  'Place Publique',            0.5,  0.6,  0.6,  0.35, 0.05, 0.08, 10, 11, 10, NULL),
  ('ps-1',   'PS',   1, 'François Hollande',  'FH',  false, 'Parti Socialiste',           0.4,  0.35, 0.55, 0.4,  0.05, 0.1,   8,  9,  8, NULL),
  -- REN
  ('ren-0',  'REN',  0, 'Gabriel Attal',      'GA',  true,  'Renaissance',               0.5,  0.4,  0.15, 0.7,  0.15, 0.1,  16, 15, 16, NULL),
  ('ren-1',  'REN',  1, 'Édouard Philippe',   'ÉP',  true,  'Horizons',                  0.5,  0.7,  0.1,  0.6,  0.3,  0.08, 18, 17, 18, NULL),
  -- LR
  ('lr-0',   'LR',   0, 'Bruno Retailleau',   'BR',  true,  NULL,                        0.5,  0.55, 0.05, 0.35, 0.6,  0.25, 10, 11, 10, NULL),
  ('lr-1',   'LR',   1, 'Laurent Wauquiez',   'LW',  true,  NULL,                        0.45, 0.5,  0.05, 0.4,  0.55, 0.2,  11, 11, 11, NULL),
  -- RN
  ('rn-0',   'RN',   0, 'Jordan Bardella',    'JB',  true,  NULL,                        0.5,  0.65, 0.1,  0.2,  0.7,  0.4,  30, 28, 30, NULL),
  ('rn-1',   'RN',   1, 'Marine Le Pen',      'MLP', true,  NULL,                        0.55, 0.5,  0.08, 0.22, 0.7,  0.45, 32, 30, 32, NULL),
  -- REC
  ('rec-0',  'REC',  0, 'Éric Zemmour',       'ÉZ',  true,  NULL,                        0.45, 0.35, 0.02, 0.08, 0.9,  0.5,   7,  6,  7, NULL),
  ('rec-1',  'REC',  1, 'Sarah Knafo',        'SK',  false, 'Extrême droite',             0.3,  0.35, 0.03, 0.1,  0.87, 0.45,  5,  4,  5, NULL);

-- 3. Sources de sondage
INSERT INTO source_sondage (type, libelle, description, icone) VALUES
  ('agrege',   'Sondage agrégé',   'Moyenne pondérée des derniers sondages publiés par les instituts majeurs.', '📊'),
  ('debiaise', 'Sondage débiaisé', 'Sondages corrigés des biais historiques des instituts (house effects).',    '🎯'),
  ('custom',   'Personnalisable',  'Définissez librement les points de départ de chaque candidat.',             '✏️');
