export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  category: 'cardiologist' | 'therapist' | 'neurologist' | 'pediatrician' | 'traumatologist' | 'pulmonologist' | 'general';
  experienceYears: number;
  rating: number;
  reviewCount: number;
  clinicName: string;
  address: string;
  distanceKm: number;
  coordinates: [number, number]; // [lat, lng]
  phone: string;
  consultationFee: string;
  availableToday: boolean;
  avatar: string;
  badges: string[];
}

export interface EmergencyCenter {
  id: string;
  name: string;
  type: 'hospital' | 'emergency_station' | 'trauma_center';
  address: string;
  phone: string;
  emergencyPhone: string;
  coordinates: [number, number];
  open24_7: boolean;
  distanceKm: number;
}

export interface FirstAidStep {
  title: string;
  instruction: string;
  criticalDoNot: string;
}

// Almaty coordinates base around Panfilov / Dostyk / Abay: [43.238949, 76.889709]
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Др. Сейітқали Айдос',
    specialty: 'Кардиолог (Жоғары санат)',
    category: 'cardiologist',
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 184,
    clinicName: 'Қалалық Кардиология Орталығы',
    address: 'Төле би көшесі, 93, Алматы',
    distanceKm: 1.2,
    coordinates: [43.2530, 76.9290],
    phone: '+7 (727) 279-01-01',
    consultationFee: '12 000 ₸',
    availableToday: true,
    avatar: '👨‍⚕️',
    badges: ['Жоғары санат', 'Шұғыл қабылдау', 'ЭКГ сарапшысы']
  },
  {
    id: 'doc-2',
    name: 'Др. Қасымова Әлия',
    specialty: 'Терапевт / Жалпы тәжірибелік дәрігер',
    category: 'therapist',
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 230,
    clinicName: 'Mediker Almaty',
    address: 'Абай даңғылы, 150, Алматы',
    distanceKm: 0.8,
    coordinates: [43.2395, 76.9120],
    phone: '+7 (727) 300-00-33',
    consultationFee: '9 000 ₸',
    availableToday: true,
    avatar: '👩‍⚕️',
    badges: ['Жедел кеңес', 'Онлайн/Офлайн', 'Универсал']
  },
  {
    id: 'doc-3',
    name: 'Др. Болатов Нұрлан',
    specialty: 'Невропатолог',
    category: 'neurologist',
    experienceYears: 16,
    rating: 4.95,
    reviewCount: 312,
    clinicName: 'Нейро-клиника «Диамед»',
    address: 'Достық даңғылы, 105, Алматы',
    distanceKm: 2.1,
    coordinates: [43.2420, 76.9580],
    phone: '+7 (727) 264-55-11',
    consultationFee: '14 000 ₸',
    availableToday: false,
    avatar: '👨‍⚕️',
    badges: ['Медицина ғылымдарының кандидаты', 'Бас сақинасы сарапшысы']
  },
  {
    id: 'doc-4',
    name: 'Др. Омарова Зере',
    specialty: 'Педиатр',
    category: 'pediatrician',
    experienceYears: 11,
    rating: 4.9,
    reviewCount: 156,
    clinicName: 'Балалар медициналық орталығы',
    address: 'Алтынсарин көшесі, 45, Алматы',
    distanceKm: 3.4,
    coordinates: [43.2210, 76.8650],
    phone: '+7 (727) 298-44-22',
    consultationFee: '10 000 ₸',
    availableToday: true,
    avatar: '👩‍⚕️',
    badges: ['Балалар маманы', 'Вакцинация']
  },
  {
    id: 'doc-5',
    name: 'Др. Серікбаев Марат',
    specialty: 'Травматолог-ортопед',
    category: 'traumatologist',
    experienceYears: 18,
    rating: 4.85,
    reviewCount: 275,
    clinicName: 'Жедел жәрдем қалалық клиникалық ауруханасы (БСНП)',
    address: 'Қазыбек би көшесі, 96, Алматы',
    distanceKm: 1.5,
    coordinates: [43.2570, 76.9270],
    phone: '+7 (727) 292-33-00',
    consultationFee: 'Тегін (МӘМС / ОСМС)',
    availableToday: true,
    avatar: '👨‍⚕️',
    badges: ['24/7 Кезекші', 'Шұғыл травмапункт']
  },
  {
    id: 'doc-6',
    name: 'Др. Жұмаділова Назым',
    specialty: 'Пульмонолог',
    category: 'pulmonologist',
    experienceYears: 12,
    rating: 4.88,
    reviewCount: 140,
    clinicName: 'Респираторлық орталық',
    address: 'Сейфуллин даңғылы, 502, Алматы',
    distanceKm: 1.9,
    coordinates: [43.2480, 76.9350],
    phone: '+7 (727) 261-22-11',
    consultationFee: '11 000 ₸',
    availableToday: true,
    avatar: '👩‍⚕️',
    badges: ['Тыныс алу жолдары', 'Аллергия']
  }
];

export const MOCK_EMERGENCY_CENTERS: EmergencyCenter[] = [
  {
    id: 'em-1',
    name: '№1 Жедел медициналық жәрдем қосалқы станциясы',
    type: 'emergency_station',
    address: 'Мақатаев көшесі, 10, Алматы',
    phone: '+7 (727) 234-56-78',
    emergencyPhone: '103',
    coordinates: [43.2660, 76.9530],
    open24_7: true,
    distanceKm: 1.1
  },
  {
    id: 'em-2',
    name: 'Қалалық шұғыл жедел көмек ауруханасы (БСНП)',
    type: 'hospital',
    address: 'Қазыбек би көшесі, 96, Алматы',
    phone: '+7 (727) 292-33-00',
    emergencyPhone: '103',
    coordinates: [43.2570, 76.9270],
    open24_7: true,
    distanceKm: 1.5
  },
  {
    id: 'em-3',
    name: 'Орталық қалалық клиникалық аурухана (12-аурухана)',
    type: 'hospital',
    address: 'Жандосов көшесі, 6, Алматы',
    phone: '+7 (727) 274-85-80',
    emergencyPhone: '103',
    coordinates: [43.2280, 76.9180],
    open24_7: true,
    distanceKm: 2.3
  }
];

export const EMERGENCY_FIRST_AID_GUIDES: Record<string, FirstAidStep[]> = {
  HEART_ATTACK: [
    {
      title: '1. Науқасты отырғызу',
      instruction: 'Науқасты жартылай отырғызып, басы мен арқасын тіреңіз. Жатқызуға болмайды (жүрекке қысым артады).',
      criticalDoNot: 'Орнынан тұруға, жүруге мүлдем рұқсат бермеңіз.'
    },
    {
      title: '2. Ауа келуін қамтамасыз ету',
      instruction: 'Терезені ашыңыз, жағаны, белдікті, қысып тұрған киімді ағытыңыз.',
      criticalDoNot: 'Науқастың айналасына көп адам үймелетпеңіз.'
    },
    {
      title: '3. Нитроглицерин / Аспирин',
      instruction: 'Егер бұрын дәрігер тағайындаған болса және қан қысымы тым төмен болмаса, тіл астына 1 таблетка нитроглицерин салыңыз.',
      criticalDoNot: 'Есі дұрыс болмаса немесе қысымы төмендесе дәрі ішкізбеңіз.'
    }
  ],
  STROKE: [
    {
      title: '1. FAST тестін тексеру (Бет, Қол, Сөз)',
      instruction: 'Күлімсіреуін сұраңыз (беті қисайған ба?), екі қолын көтеруін сұраңыз (бір қолы салбырай ма?), қарапайым сөйлемді қайталауын сұраңыз.',
      criticalDoNot: 'Уақытты созбаңыз! Инсульт кезіндегі "алтын уақыт" — 4.5 сағат.'
    },
    {
      title: '2. Басын 30 градусқа көтеріп жатқызу',
      instruction: 'Басы мен иығының астына жастық қойып, бүйіріне қарай аздап бұрыңыз (құсық тыныс жолына кетпеуі үшін).',
      criticalDoNot: 'Су, тамақ немесе дәрі-дәрмек (қысым түсіретін дәрі) бермеңіз!'
    }
  ],
  BLEEDING: [
    {
      title: '1. Тікелей қысым түсіру',
      instruction: 'Таза шүберек немесе бинтпен жараның үстін қатты басып тұрыңыз.',
      criticalDoNot: 'Жарадан шығып тұрған бөгде заттарды (әйнек, пышақ) суырмаңыз!'
    },
    {
      title: '2. Аяқ-қолды жоғары көтеру',
      instruction: 'Қан ағып жатқан қолды немесе аяқты жүрек деңгейінен жоғары ұстаңыз.',
      criticalDoNot: 'Жгутты дәл білмесеңіз байламаңыз, тек күре тамырлық қатты атқылаған қанда ғана салынады.'
    }
  ],
  DEFAULT: [
    {
      title: '1. Науқасты қауіпсіз жерге орналастыру',
      instruction: 'Науқасты жайлы жерге отырғызыңыз немесе жатқызыңыз. Тыныштық сақтауға көмектесіңіз.',
      criticalDoNot: 'Дүрбелеңге түспеңіз және науқасты жалғыз қалдырмаңыз.'
    },
    {
      title: '2. 103 Жедел жәрдем шақыру',
      instruction: '103 нөміріне нақты мекенжайды, науқастың жасын және нақты белгілерін хабарлаңыз.',
      criticalDoNot: 'Диспетчер сұрағын толық тыңдамай телефонды үзбеңіз.'
    }
  ]
};
