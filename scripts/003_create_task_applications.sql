-- Тапсырмаға өтініштер
CREATE TABLE IF NOT EXISTS task_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  photo_proof_url TEXT,
  ai_verification_status TEXT CHECK (ai_verification_status IN ('pending', 'approved', 'flagged')),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(task_id, volunteer_id)
);

ALTER TABLE task_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applications_select_own_or_admin" ON task_applications;
CREATE POLICY "applications_select_own_or_admin" ON task_applications FOR SELECT USING (
  volunteer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "applications_insert_own" ON task_applications;
CREATE POLICY "applications_insert_own" ON task_applications FOR INSERT WITH CHECK (volunteer_id = auth.uid());

DROP POLICY IF EXISTS "applications_update_admin" ON task_applications;
CREATE POLICY "applications_update_admin" ON task_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
