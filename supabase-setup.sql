-- Ejecuta este script en el SQL Editor de Supabase
-- para configurar la base de datos para JLTOOLS2

-- 1. Crear tabla apps
CREATE TABLE IF NOT EXISTS apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear bucket de almacenamiento para imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-images', 'app-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de storage
CREATE POLICY IF NOT EXISTS "Public Upload"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'app-images');

CREATE POLICY IF NOT EXISTS "Public View"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'app-images');

CREATE POLICY IF NOT EXISTS "Public Delete"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'app-images');

-- 4. Habilitar RLS en tabla apps
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de RLS para apps
CREATE POLICY IF NOT EXISTS "Public Read"
ON apps FOR SELECT
TO anon
USING (true);

CREATE POLICY IF NOT EXISTS "Public Insert"
ON apps FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Public Update"
ON apps FOR UPDATE
TO anon
USING (true);

CREATE POLICY IF NOT EXISTS "Public Delete"
ON apps FOR DELETE
TO anon
USING (true);
