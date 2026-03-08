-- ============================================
-- SimuPresident - Candidats supplémentaires
-- À exécuter APRÈS seed.sql
-- ============================================

INSERT INTO candidat (id, parti_tag, indice_variante, nom, nom_court, initiales, sonde_individuellement, groupe_sondage, attractivite, tendance, ideologie_gauche, ideologie_centre, ideologie_droite, taux_barrage, start_agrege, start_debiaise, start_personnalise, photo_url) VALUES
  -- RN (existants : JB idx 0, MLP idx 1)
  ('rn-2', 'RN', 2, 'Louis Aliot',          'Aliot',        'LA',  false, 'RN / Extrême droite',        0.35, 0.4,  0.05, 0.25, 0.7,  0.38, 24, 22, 24, NULL),
  ('rn-3', 'RN', 3, 'Sébastien Chenu',      'Chenu',        'SC',  false, 'RN / Extrême droite',        0.3,  0.35, 0.08, 0.2,  0.72, 0.4,  22, 20, 22, NULL),

  -- LFI (existants : JLM idx 0, MP idx 1)
  ('lfi-2', 'LFI', 2, 'Manuel Bompard',      'Bompard',      'MB',  false, 'LFI / NUPES',               0.35, 0.4,  0.78, 0.17, 0.05, 0.32, 8,  9,  8,  NULL),
  ('lfi-3', 'LFI', 3, 'Clémence Guetté',     'Guetté',       'CG',  false, 'LFI / NUPES',               0.3,  0.45, 0.75, 0.2,  0.05, 0.28, 7,  8,  7,  NULL),

  -- REN (existants : GA idx 0, GD idx 1)
  ('ren-2', 'REN', 2, 'Élisabeth Borne',     'Borne',        'EB',  false, 'Majorité présidentielle',    0.35, 0.3,  0.2,  0.65, 0.15, 0.15, 12, 11, 12, NULL),
  ('ren-3', 'REN', 3, 'François Bayrou',     'Bayrou',       'FB',  true,  NULL,                         0.4,  0.45, 0.15, 0.7,  0.15, 0.12, 10, 10, 10, NULL),

  -- LR (existants : BR idx 0, LW idx 1)
  ('lr-2', 'LR', 2, 'Xavier Bertrand',       'Bertrand',     'XB',  false, 'Droite républicaine',        0.45, 0.5,  0.1,  0.45, 0.45, 0.15, 7,  8,  7,  NULL),
  ('lr-3', 'LR', 3, 'Valérie Pécresse',     'Pécresse',     'VP',  false, 'Droite républicaine',        0.3,  0.3,  0.08, 0.45, 0.47, 0.2,  5,  6,  5,  NULL),

  -- PS (existant : RG idx 0)
  ('ps-1', 'PS', 1, 'François Hollande',     'Hollande',     'FH',  false, 'Gauche sociale-démocrate',   0.4,  0.35, 0.55, 0.4,  0.05, 0.15, 7,  8,  7,  NULL),
  ('ps-2', 'PS', 2, 'Olivier Faure',         'Faure',        'OF',  false, 'Gauche sociale-démocrate',   0.25, 0.3,  0.6,  0.35, 0.05, 0.1,  4,  5,  4,  NULL),

  -- EELV (existant : MT idx 0)
  ('eelv-1', 'EELV', 1, 'Yannick Jadot',     'Jadot',        'YJ',  false, 'EELV / Pôle écologiste',    0.4,  0.35, 0.5,  0.45, 0.05, 0.12, 4,  5,  4,  NULL),
  ('eelv-2', 'EELV', 2, 'Sandrine Rousseau', 'Rousseau',     'SR',  false, 'EELV / Pôle écologiste',    0.35, 0.4,  0.65, 0.3,  0.05, 0.18, 3,  4,  3,  NULL),

  -- HOR (existant : ÉP idx 0)
  ('hor-1', 'HOR', 1, 'Antoine Armand',      'Armand',       'AA',  false, 'Majorité présidentielle',    0.3,  0.35, 0.15, 0.6,  0.25, 0.08, 8,  7,  8,  NULL),

  -- REC (existant : FR idx 0)
  ('rec-1', 'REC', 1, 'Clémentine Autain',   'Autain',       'CA',  false, 'Gauche dissidente / ex-LFI', 0.35, 0.4,  0.68, 0.27, 0.05, 0.1,  4,  4,  4,  NULL);
