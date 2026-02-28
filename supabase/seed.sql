-- ============================================
-- SimuPresident - Données initiales (seed)
-- À exécuter dans Supabase APRÈS schema.sql
-- ============================================

-- 0. Nettoyage (candidats d'abord à cause de la FK vers parti)
DELETE FROM candidat;
DELETE FROM parti;
DELETE FROM source_sondage;

-- 1. Partis politiques
INSERT INTO parti (tag, nom, actif, couleur_fond, couleur_texte, couleur_accent, couleur_graphique) VALUES
  ('RN',   'Rassemblement National',  true, '#1B2A4A', '#EEEDFF', '#002395', '#002395'),
  ('LFI',  'La France Insoumise',     true, '#CC2443', '#FFFFFF', '#E63946', '#E63946'),
  ('REN',  'Renaissance',             true, '#FFD600', '#1a1a1a', '#FFB800', '#FFB800'),
  ('LR',   'Les Républicains',        true, '#0066CC', '#FFFFFF', '#004A99', '#0066CC'),
  ('PS',   'Parti Socialiste',        true, '#FF6B9D', '#FFFFFF', '#E0476E', '#FF6B9D'),
  ('PP',   'Place Publique',          true, '#C850C0', '#FFFFFF', '#A03090', '#C850C0'),
  ('EELV', 'Les Écologistes',         true, '#00A86B', '#FFFFFF', '#008C57', '#00A86B'),
  ('HOR',  'Horizons',                true, '#00C2D1', '#FFFFFF', '#009DAA', '#00C2D1'),
  ('REC',  'Picardie Debout!',        true, '#8B5CF6', '#FFFFFF', '#7C3AED', '#8B5CF6');

-- 2. Candidats (variantes)
-- photo_url : uploader les photos dans le bucket Supabase Storage "photos" (public)
-- puis mettre à jour avec :
--   UPDATE candidat SET photo_url = 'https://<PROJET>.supabase.co/storage/v1/object/public/photos/<fichier>' WHERE id = '...';
INSERT INTO candidat (id, parti_tag, indice_variante, nom, initiales, sonde_individuellement, groupe_sondage, attractivite, tendance, ideologie_gauche, ideologie_centre, ideologie_droite, taux_barrage, start_agrege, start_debiaise, start_personnalise, photo_url) VALUES
  -- RN
  ('rn-0',   'RN',   0, 'Jordan Bardella',    'JB',  true,  NULL,                          0.5,  0.65, 0.1,  0.2,  0.7,  0.4,  28, 26, 28, NULL),
  ('rn-1',   'RN',   1, 'Marine Le Pen',      'MLP', true,  NULL,                          0.55, 0.5,  0.08, 0.22, 0.7,  0.45, 30, 28, 30, NULL),
  -- LFI
  ('lfi-0',  'LFI',  0, 'Jean-Luc Mélenchon', 'JLM', true,  NULL,                          0.5,  0.35, 0.8,  0.15, 0.05, 0.35, 12, 14, 12, NULL),
  ('lfi-1',  'LFI',  1, 'Mathilde Panot',     'MP',  false, 'LFI / NUPES',                 0.4,  0.45, 0.75, 0.2,  0.05, 0.3,   9, 10,  9, NULL),
  -- REN
  ('ren-0',  'REN',  0, 'Gabriel Attal',      'GA',  true,  NULL,                          0.5,  0.4,  0.15, 0.7,  0.15, 0.1,  18, 16, 18, NULL),
  ('ren-1',  'REN',  1, 'Gérald Darmanin',    'GD',  false, 'Majorité présidentielle',     0.35, 0.35, 0.1,  0.55, 0.35, 0.2,  15, 14, 15, NULL),
  -- LR
  ('lr-0',   'LR',   0, 'Bruno Retailleau',   'BR',  true,  NULL,                          0.5,  0.55, 0.05, 0.35, 0.6,  0.25,  8,  9,  8, NULL),
  ('lr-1',   'LR',   1, 'Laurent Wauquiez',   'LW',  true,  NULL,                          0.45, 0.5,  0.05, 0.4,  0.55, 0.2,   9,  9,  9, NULL),
  -- PS
  ('ps-0',   'PS',   0, 'François Hollande',  'FH',  false, 'Gauche sociale-démocrate',     0.4,  0.35, 0.55, 0.4,  0.05, 0.1,   7,  8,  7, NULL),
  ('ps-1',   'PS',   1, 'Olivier Faure',      'OF',  false, 'Gauche sociale-démocrate',     0.25, 0.3,  0.6,  0.35, 0.05, 0.08,  4,  5,  4, NULL),
  -- PP
  ('pp-0',   'PP',   0, 'Raphaël Glucksmann', 'RG',  true,  NULL,                          0.5,  0.6,  0.6,  0.35, 0.05, 0.08, 10, 11, 10, NULL),
  -- EELV
  ('eelv-0', 'EELV', 0, 'Marine Tondelier',   'MT',  false, 'EELV / Pôle écologiste',      0.5,  0.55, 0.55, 0.4,  0.05, 0.1,   5,  6,  5, NULL),
  -- HOR
  ('hor-0',  'HOR',  0, 'Édouard Philippe',   'ÉP',  true,  NULL,                          0.5,  0.7,  0.1,  0.6,  0.3,  0.08, 14, 13, 14, NULL),
  -- REC
  ('rec-0',  'REC',  0, 'François Ruffin',    'FR',  false, 'Gauche dissidente / ex-LFI',  0.5,  0.45, 0.7,  0.25, 0.05, 0.12,  5,  5,  5, NULL);

-- 3. Sources de sondage
INSERT INTO source_sondage (type, libelle, description, icone) VALUES
  ('agrege',   'Sondage agrégé',   'Moyenne pondérée des derniers sondages publiés par les instituts majeurs.', '📊'),
  ('debiaise', 'Sondage débiaisé', 'Sondages corrigés des biais historiques des instituts (house effects).',    '🎯'),
  ('custom',   'Personnalisable',  'Définissez librement les points de départ de chaque candidat.',             '✏️');
