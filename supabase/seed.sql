-- ============================================
-- SimuPresident - Données initiales (seed)
-- À exécuter dans Supabase APRÈS schema.sql
-- ============================================

-- 1. Partis politiques
INSERT INTO parti (tag, nom, actif, couleur_fond, couleur_texte, couleur_accent, couleur_graphique) VALUES
  ('RN',   'Rassemblement National',  true, '#1B2A4A', '#EEEDFF', '#002395', '#002395'),
  ('LFI',  'La France Insoumise',     true, '#CC2443', '#FFFFFF', '#E63946', '#E63946'),
  ('REN',  'Renaissance',             true, '#FFD600', '#1a1a1a', '#FFB800', '#FFB800'),
  ('LR',   'Les Républicains',        true, '#0066CC', '#FFFFFF', '#004A99', '#0066CC'),
  ('PS',   'Place Publique / PS',     true, '#FF6B9D', '#FFFFFF', '#E0476E', '#FF6B9D'),
  ('EELV', 'Les Écologistes',         true, '#00A86B', '#FFFFFF', '#008C57', '#00A86B'),
  ('HOR',  'Horizons',                true, '#00C2D1', '#FFFFFF', '#009DAA', '#00C2D1'),
  ('REC',  'Picardie Debout!',        true, '#8B5CF6', '#FFFFFF', '#7C3AED', '#8B5CF6');

-- 2. Candidats (variantes)
INSERT INTO candidat (id, parti_tag, indice_variante, nom, initiales, sonde_individuellement, groupe_sondage, attractivite, tendance, ideologie_gauche, ideologie_centre, ideologie_droite, taux_barrage, start_agrege, start_debiaise, start_personnalise) VALUES
  -- RN
  ('rn-0',   'RN',   0, 'Jordan Bardella',    'JB',  true,  NULL,                          0.5,  0.65, 0.1,  0.2,  0.7,  0.4,  28, 26, 28),
  ('rn-1',   'RN',   1, 'Marine Le Pen',      'MLP', true,  NULL,                          0.55, 0.5,  0.08, 0.22, 0.7,  0.45, 30, 28, 30),
  -- LFI
  ('lfi-0',  'LFI',  0, 'Jean-Luc Mélenchon', 'JLM', true,  NULL,                          0.5,  0.35, 0.8,  0.15, 0.05, 0.35, 12, 14, 12),
  ('lfi-1',  'LFI',  1, 'Mathilde Panot',     'MP',  false, 'LFI / NUPES',                 0.4,  0.45, 0.75, 0.2,  0.05, 0.3,   9, 10,  9),
  -- REN
  ('ren-0',  'REN',  0, 'Gabriel Attal',      'GA',  true,  NULL,                          0.5,  0.4,  0.15, 0.7,  0.15, 0.1,  18, 16, 18),
  ('ren-1',  'REN',  1, 'Gérald Darmanin',    'GD',  false, 'Majorité présidentielle',     0.35, 0.35, 0.1,  0.55, 0.35, 0.2,  15, 14, 15),
  -- LR
  ('lr-0',   'LR',   0, 'Bruno Retailleau',   'BR',  true,  NULL,                          0.5,  0.55, 0.05, 0.35, 0.6,  0.25,  8,  9,  8),
  ('lr-1',   'LR',   1, 'Laurent Wauquiez',   'LW',  true,  NULL,                          0.45, 0.5,  0.05, 0.4,  0.55, 0.2,   9,  9,  9),
  -- PS
  ('ps-0',   'PS',   0, 'Raphaël Glucksmann', 'RG',  true,  NULL,                          0.5,  0.6,  0.6,  0.35, 0.05, 0.08, 10, 11, 10),
  -- EELV
  ('eelv-0', 'EELV', 0, 'Marine Tondelier',   'MT',  false, 'EELV / Pôle écologiste',      0.5,  0.55, 0.55, 0.4,  0.05, 0.1,   5,  6,  5),
  -- HOR
  ('hor-0',  'HOR',  0, 'Édouard Philippe',   'ÉP',  true,  NULL,                          0.5,  0.7,  0.1,  0.6,  0.3,  0.08, 14, 13, 14),
  -- REC
  ('rec-0',  'REC',  0, 'François Ruffin',    'FR',  false, 'Gauche dissidente / ex-LFI',  0.5,  0.45, 0.7,  0.25, 0.05, 0.12,  5,  5,  5);

-- 3. Sources de sondage
INSERT INTO source_sondage (type, libelle, description, icone) VALUES
  ('agrege',   'Sondage agrégé',   'Moyenne pondérée des derniers sondages publiés par les instituts majeurs.', '📊'),
  ('debiaise', 'Sondage débiaisé', 'Sondages corrigés des biais historiques des instituts (house effects).',    '🎯'),
  ('custom',   'Personnalisable',  'Définissez librement les points de départ de chaque candidat.',             '✏️');
