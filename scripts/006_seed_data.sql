-- Бастапқы деректер: Skill Categories
INSERT INTO skill_categories (name_kk, name_ru, name_en, icon, color) VALUES
('Экология', 'Экология', 'Ecology', 'leaf', '#22c55e'),
('Білім беру', 'Образование', 'Education', 'book-open', '#3b82f6'),
('Әлеуметтік көмек', 'Социальная помощь', 'Social Help', 'heart', '#ef4444'),
('Денсаулық', 'Здоровье', 'Health', 'activity', '#f97316'),
('Мәдениет', 'Культура', 'Culture', 'palette', '#8b5cf6'),
('Технология', 'Технологии', 'Technology', 'cpu', '#06b6d4')
ON CONFLICT DO NOTHING;

-- Бастапқы марапаттар
INSERT INTO badges (name_kk, name_ru, name_en, description_kk, description_ru, description_en, icon, xp_required, category) VALUES
('Жаңа бастама', 'Новое начало', 'Fresh Start', 'Бірінші тапсырманы орында', 'Выполни первое задание', 'Complete first task', 'rocket', 50, 'beginner'),
('Алтын жүрек', 'Золотое сердце', 'Golden Heart', '10 тапсырма орында', 'Выполни 10 заданий', 'Complete 10 tasks', 'heart', 500, 'intermediate'),
('Қала қорғаушысы', 'Защитник города', 'City Guardian', '50 тапсырма орында', 'Выполни 50 заданий', 'Complete 50 tasks', 'shield', 2500, 'advanced'),
('Эко батыр', 'Эко герой', 'Eco Hero', '20 экология тапсырмасын орында', 'Выполни 20 экологических заданий', 'Complete 20 ecology tasks', 'leaf', 1000, 'ecology'),
('Ұстаз', 'Учитель', 'Teacher', '10 білім беру тапсырмасын орында', 'Выполни 10 образовательных заданий', 'Complete 10 education tasks', 'graduation-cap', 500, 'education')
ON CONFLICT DO NOTHING;

-- Demo тапсырмалар (admin user болмаса да көрінуі үшін created_by = NULL)
INSERT INTO tasks (title, description, category, location, city, xp_reward, max_volunteers, status, start_date, end_date) VALUES
('Көктем тазалығы', 'Қала паркін тазалау және ағаш отырғызу акциясы. Қол ғап пен қапшықтар беріледі.', 'ecology', 'Орталық парк', 'Алматы', 100, 20, 'open', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '4 hours'),
('Балаларға ағылшын тілі', 'Балалар үйіндегі балаларға ағылшын тілінен тегін сабақ беру. Аптасына 2 рет.', 'education', 'Балалар үйі №3', 'Астана', 150, 5, 'open', NOW() + INTERVAL '1 day', NOW() + INTERVAL '30 days'),
('Қан тапсыру акциясы', 'Қан банкіне қан тапсыру арқылы адам өмірін құтқаруға көмектесу.', 'health', 'Қалалық қан орталығы', 'Шымкент', 200, 50, 'open', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '8 hours'),
('Қарттарға көмек', 'Жалғызбасты қарттарға азық-түлік жеткізу және үй шаруасына көмектесу.', 'social', 'Әр түрлі аудандар', 'Алматы', 80, 15, 'in_progress', NOW() - INTERVAL '2 days', NOW() + INTERVAL '14 days'),
('Мәдени мұра күні', 'Музейде экскурсия өткізу және келушілерге көмектесу.', 'culture', 'Орталық музей', 'Астана', 120, 10, 'open', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '6 hours')
ON CONFLICT DO NOTHING;
