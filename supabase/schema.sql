-- =========================================================================
-- MedTech HomeCare: Supabase Database Schema & Initial Data
-- =========================================================================

-- 1. Тазалау: Бұрынғы кестелерді өшіру
DROP TABLE IF EXISTS public.care_requests CASCADE;
DROP TABLE IF EXISTS public.family_patients CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.marketplace CASCADE;

-- 2. Қолданушылар профилі (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'nurse', 'psychologist', 'dispatcher')),
  full_name TEXT NOT NULL,
  phone TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Отбасы мүшелері мен үйдегі науқастар (Family Patients)
CREATE TABLE IF NOT EXISTS public.family_patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relation TEXT,
  age INT,
  gender TEXT,
  blood_type TEXT,
  diagnosis TEXT,
  chronic_conditions JSONB DEFAULT '[]'::jsonb,
  allergies JSONB DEFAULT '[]'::jsonb,
  last_vitals JSONB DEFAULT '{}'::jsonb,
  medications JSONB DEFAULT '[]'::jsonb,
  doctor_advice TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Үйге медициналық көмек шақыртулары (Care Requests)
CREATE TABLE IF NOT EXISTS public.care_requests (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age INT,
  phone TEXT,
  address TEXT NOT NULL,
  coordinates JSONB DEFAULT '[43.2389, 76.8897]'::jsonb,
  care_type TEXT NOT NULL CHECK (care_type IN ('doctor', 'nurse', 'psychologist', 'emergency')),
  specialty_needed TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'URGENT_YELLOW',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'en_route', 'completed', 'cancelled')),
  assigned_specialist_id TEXT,
  assigned_specialist_name TEXT,
  assigned_specialist_phone TEXT,
  specialist_role TEXT,
  notes TEXT,
  vital_signs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- RLS (Row Level Security) Саясаттарын қосу
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_requests ENABLE ROW LEVEL SECURITY;

-- Барлық қолданушыларға оқу және қосу рұқсатын беру (Ашық демо саясаты)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public read family_patients" ON public.family_patients FOR SELECT USING (true);
CREATE POLICY "Public insert family_patients" ON public.family_patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update family_patients" ON public.family_patients FOR UPDATE USING (true);

CREATE POLICY "Public read care_requests" ON public.care_requests FOR SELECT USING (true);
CREATE POLICY "Public insert care_requests" ON public.care_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update care_requests" ON public.care_requests FOR UPDATE USING (true);

-- =========================================================================
-- Бастапқы Деректерді (Seed Data) Енгізу
-- =========================================================================

-- Отбасы науқастары
INSERT INTO public.family_patients (id, name, relation, age, gender, blood_type, diagnosis, chronic_conditions, allergies, last_vitals, medications, doctor_advice)
VALUES
(
  'fam-1',
  'Қайрат ақсақал',
  'Атасы',
  72,
  'Ер',
  'A(II) Rh+',
  'Жүректің ишемиялық ауруы, 2-дәрежелі гипертония',
  '["Жүрек жеткіліксіздігі", "Созылмалы гипертония"]'::jsonb,
  '["Пенициллин"]'::jsonb,
  '{"bloodPressure": "155/95", "temperature": "36.7°C", "pulse": "82", "recordedAt": "Кеше, сағат 20:30"}'::jsonb,
  '[
    {"name": "Лизиноприл", "dosage": "10 мг", "timing": "Таңертең сағат 09:00-де", "notes": "Қысымды түсіру"},
    {"name": "Кардиомагнил", "dosage": "75 мг", "timing": "Кешкі 20:00-де", "notes": "Қан сұйылту"},
    {"name": "Бисопролол", "dosage": "5 мг", "timing": "Таңертең 09:00-де", "notes": "Жүрек ырғағы"}
  ]'::jsonb,
  'Тұзды шектеу. Тәулігіне 1.5 литрден артық сұйықтық ішпеу. Күніне 2 рет қысым өлшеу.'
),
(
  'fam-2',
  'Айсұлу апай',
  'Анасы',
  68,
  'Әйел',
  'B(III) Rh+',
  '2-типті қант диабеті, отадан кейінгі оңалту',
  '["Қант диабеті", "Варикоз"]'::jsonb,
  '["Аспирин"]'::jsonb,
  '{"bloodPressure": "130/80", "temperature": "36.6°C", "pulse": "76", "glucose": "6.8 ммоль/л", "recordedAt": "Бүгін, сағат 08:00"}'::jsonb,
  '[
    {"name": "Метформин", "dosage": "850 мг", "timing": "Күніне 2 рет", "notes": "Қант реттеу"},
    {"name": "Инсулин Лантус", "dosage": "14 ЕД", "timing": "Кешкі 21:00-де", "notes": "Тері астына"}
  ]'::jsonb,
  'Көмірсуларды қатаң бақылау. Операциядан кейінгі жараны күнделікті тазалап таңу.'
);

-- Бастапқы шақыртулар
INSERT INTO public.care_requests (id, patient_name, patient_age, phone, address, coordinates, care_type, specialty_needed, symptoms, urgency, status, assigned_specialist_id, assigned_specialist_name, assigned_specialist_phone, specialist_role, notes)
VALUES
(
  'req-101',
  'Қайрат ақсақал',
  72,
  '+7 (701) 234-56-78',
  'Алматы қ., Абай даңғылы, 140, 24-пәтер',
  '[43.2395, 76.9120]'::jsonb,
  'doctor',
  'Кардиолог / Терапевт',
  'Созылмалы жүрек ауруы, қан қысымы 170/100 көтеріліп, ентігу мазалап тұр.',
  'URGENT_YELLOW',
  'en_route',
  'doc-1',
  'Др. Сейітқали Айдос',
  '+7 (727) 279-01-01',
  'Кардиолог (Жоғары санат)',
  'Дәрігер жолда. Шамамен 10 минутта жетеді.'
),
(
  'req-102',
  'Айсұлу апай',
  68,
  '+7 (777) 345-67-89',
  'Алматы қ., Төле би көшесі, 85, 12-пәтер',
  '[43.2530, 76.9290]'::jsonb,
  'nurse',
  'Медбике (Патронаж)',
  'Отадан кейінгі жараны таңу (перевязка) және капельница қою.',
  'NON_URGENT_GREEN',
  'pending',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
);
