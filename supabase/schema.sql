-- ============================================================
-- RÉUSSIR POLYTECH — MISE À JOUR ET VÉRIFICATION DE LA BASE DE DONNÉES
-- À copier-coller dans le SQL Editor de Supabase (puis cliquer sur RUN)
-- ============================================================

-- 1. Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  matricule TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('MSP1', 'MSP2', 'ALUMNI')),
  avatar_url TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Si la table existait déjà sans la colonne email, on l'ajoute :
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Activation de la sécurité Row Level Security (RLS) sur les profils
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profils visibles par tous les membres connectes') THEN
    CREATE POLICY "Profils visibles par tous les membres connectes"
      ON public.profiles FOR SELECT TO authenticated USING (TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profils visibles en lecture publique pour matricule') THEN
    CREATE POLICY "Profils visibles en lecture publique pour matricule"
      ON public.profiles FOR SELECT TO anon USING (TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Modification autorisee uniquement par l etudiant') THEN
    CREATE POLICY "Modification autorisee uniquement par l etudiant"
      ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Insertion autorisee a la creation') THEN
    CREATE POLICY "Insertion autorisee a la creation"
      ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- 3. Table des demandes de corrections payantes
CREATE TABLE IF NOT EXISTS public.correction_requests (
  id UUID DEFAULT GEN_RANDOM_UUID() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  matricule TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  academic_level TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VALIDATED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE public.correction_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'correction_requests' AND policyname = 'Demandes lisibles par leur createur') THEN
    CREATE POLICY "Demandes lisibles par leur createur"
      ON public.correction_requests FOR SELECT TO authenticated USING (auth.uid() = student_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'correction_requests' AND policyname = 'Creation de demande autorisee aux connectes') THEN
    CREATE POLICY "Creation de demande autorisee aux connectes"
      ON public.correction_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
  END IF;
END
$$;
