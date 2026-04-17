-- AMANAT IDEATHON - Schema Update
-- 1. Truncate existing data to start fresh for the hackathon
TRUNCATE TABLE public.applications CASCADE;
TRUNCATE TABLE public.tasks CASCADE;

-- 2. Update Roles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'admin'));

-- 3. Update Categories to AMANAT Tracks
-- First drop existing constraint if it was implicitly created, but since we didn't constrain earlier, we just update data.
-- Actually, our previous schema didn't have a CHECK constraint on category, just a TEXT type.
-- We keep it as TEXT but AI will generate these exact strings:
-- "PropTech & CityTech", "MedTech", "LegalTech", "EdTech", "Community Tech"

-- 4. Create Marketplace Table
CREATE TABLE IF NOT EXISTS public.marketplace (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  cost_xp INTEGER NOT NULL,
  color_code TEXT DEFAULT 'bg-emerald-500',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Marketplace
ALTER TABLE public.marketplace ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Marketplace items are viewable by everyone" ON public.marketplace FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage marketplace" ON public.marketplace FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Insert Demo Marketplace Items Let volunteer have something immediately
INSERT INTO public.marketplace (title, brand, cost_xp, color_code) VALUES
('Kinopark Ticket', 'Kinopark', 1200, 'bg-rose-500'),
('Grande Coffee', 'Starbucks', 500, 'bg-amber-500'),
('Python Course', 'Alem School', 3500, 'bg-blue-500');
