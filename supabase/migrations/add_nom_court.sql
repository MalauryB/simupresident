-- ============================================
-- Migration: Ajouter le champ nom_court
-- Date: 2026-03-08
-- Description: Ajoute un champ nom_court pour afficher les noms courts des candidats
-- ============================================

-- Ajouter la colonne nom_court
ALTER TABLE candidat ADD COLUMN IF NOT EXISTS nom_court VARCHAR;

-- Mettre à jour les valeurs existantes avec les noms courts
UPDATE candidat SET nom_court = 'Mélenchon' WHERE id = 'lfi-0';
UPDATE candidat SET nom_court = 'Panot' WHERE id = 'lfi-1';
UPDATE candidat SET nom_court = 'Guetté' WHERE id = 'lfi-2';
UPDATE candidat SET nom_court = 'Bompard' WHERE id = 'lfi-3';

UPDATE candidat SET nom_court = 'Tondelier' WHERE id = 'eelv-0';
UPDATE candidat SET nom_court = 'Ruffin' WHERE id = 'eelv-1';
UPDATE candidat SET nom_court = 'Autain' WHERE id = 'eelv-2';

UPDATE candidat SET nom_court = 'Glucksmann' WHERE id = 'ps-0';
UPDATE candidat SET nom_court = 'Hollande' WHERE id = 'ps-1';

UPDATE candidat SET nom_court = 'Attal' WHERE id = 'ren-0';
UPDATE candidat SET nom_court = 'Philippe' WHERE id = 'ren-1';

UPDATE candidat SET nom_court = 'Retailleau' WHERE id = 'lr-0';
UPDATE candidat SET nom_court = 'Wauquiez' WHERE id = 'lr-1';

UPDATE candidat SET nom_court = 'Bardella' WHERE id = 'rn-0';
UPDATE candidat SET nom_court = 'Le Pen' WHERE id = 'rn-1';

UPDATE candidat SET nom_court = 'Zemmour' WHERE id = 'rec-0';
UPDATE candidat SET nom_court = 'Knafo' WHERE id = 'rec-1';
