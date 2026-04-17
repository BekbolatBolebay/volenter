-- Дағдылар ағашы (Skill Tree)
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_kk TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES skill_categories(id),
  xp_amount INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "skill_categories_select_all" ON skill_categories;
CREATE POLICY "skill_categories_select_all" ON skill_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "user_skills_select_all" ON user_skills;
CREATE POLICY "user_skills_select_all" ON user_skills FOR SELECT USING (true);
