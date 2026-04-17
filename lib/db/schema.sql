-- Alem AI - Database Schema for AMANAT IDEATHON

-- 1. Profiles (Volunteers)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  skills JSONB DEFAULT '[]', -- [{ "name": "Ecology", "level": 1, "xp": 0 }]
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tasks (Quests)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  xp INTEGER DEFAULT 100,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed', 'archived')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Applications (Quest Submissions & AI Verification)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged')),
  proof_image_url TEXT,
  ai_audit_score INTEGER,
  ai_audit_reason TEXT,
  ai_audit_flags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Impact Stats (For Charts)
CREATE TABLE IF NOT EXISTS public.impact_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  volunteer_id UUID REFERENCES auth.users(id),
  month TEXT NOT NULL, -- 'Jan', 'Feb', etc.
  impact_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Tasks are viewable by everyone" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Admins can insert tasks" ON public.tasks FOR INSERT WITH CHECK (true); -- Simplified for hackathon

CREATE POLICY "Applications viewable by owner and admin" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Volunteers can apply" ON public.applications FOR INSERT WITH CHECK (auth.uid() = volunteer_id);

-- Initial Data
INSERT INTO public.tasks (title, description, category, xp) VALUES 
('Clean the River Bank', 'Help us clean up the city river.', 'Ecology', 200),
('Teach Coding to Kids', 'Provide basic HTML/CSS lessons.', 'Education', 500),
('Elderly Care Visit', 'Socialize with seniors at the local center.', 'Social Care', 300);
