-- SG MOTORS — migration v2
-- À exécuter une fois dans Supabase > SQL Editor.

-- Véhicules : visibilité (Sur parc / Sur RDV / Chez fournisseur) et informations complémentaires
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS visibility text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS extra_info text;
ALTER TABLE vehicles ALTER COLUMN doors SET DEFAULT 5;

-- Notes (onglet Notes de l'Espace Pro)
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Accès uniquement via les routes API (clé service_role), aucune lecture publique.
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
