-- ============================================
-- SimuPresident - Table message_contact
-- À exécuter dans Supabase APRÈS schema.sql
-- ============================================

CREATE TABLE message_contact (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sujet VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS : les visiteurs peuvent insérer, seul le service role peut lire
ALTER TABLE message_contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertion publique"
  ON message_contact FOR INSERT
  WITH CHECK (true);
