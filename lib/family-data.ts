export interface Medication {
  name: string;
  dosage: string;
  timing: string;
  notes: string;
}

export interface FamilyPatient {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  bloodType: string;
  diagnosis: string;
  chronicConditions: string[];
  allergies: string[];
  lastVitals: {
    bloodPressure: string;
    temperature: string;
    pulse: string;
    glucose?: string;
    recordedAt: string;
  };
  medications: Medication[];
  doctorAdvice: string;
  lastDoctorVisit: {
    doctorName: string;
    specialty: string;
    date: string;
    conclusion: string;
  };
  scheduledCare: {
    careType: string;
    specialistName: string;
    time: string;
    task: string;
  };
}

export const MOCK_FAMILY_PATIENTS: FamilyPatient[] = [
  {
    id: "fam-1",
    name: "Қайрат ақсақал (Атасы)",
    relation: "Атасы",
    age: 72,
    gender: "Ер",
    bloodType: "A(II) Rh+",
    diagnosis: "Жүректің ишемиялық ауруы, 2-дәрежелі гипертония",
    chronicConditions: ["Жүрек жеткіліксіздігі", "Созылмалы гипертония", "Буын артрозы"],
    allergies: ["Пенициллин тобындағы антибиотиктер"],
    lastVitals: {
      bloodPressure: "155/95",
      temperature: "36.7°C",
      pulse: "82",
      recordedAt: "Кеше, сағат 20:30"
    },
    medications: [
      { name: "Лизиноприл", dosage: "10 мг", timing: "Таңертең сағат 09:00-де (тамақтан кейін)", notes: "Қан қысымын түсіру үшін" },
      { name: "Кардиомагнил", dosage: "75 мг", timing: "Кешкі сағат 20:00-де", notes: "Қанды сұйылту үшін" },
      { name: "Бисопролол", dosage: "5 мг", timing: "Таңертең сағат 09:00-де", notes: "Жүрек соғысын тұрақтандыру" }
    ],
    doctorAdvice: "Тұзды тағамдарды күрт азайту. Тәулігіне 1.5 литрден артық сұйықтық ішпеу. Күніне кемінде 2 рет қан қысымын өлшеп журналға жазу.",
    lastDoctorVisit: {
      doctorName: "Др. Сейітқали Айдос",
      specialty: "Кардиолог",
      date: "04 қыркүйек 2026",
      conclusion: "Жүрек жағдайы қалыпты деңгейде бақылауда. Лизиноприл дозасы 10 мг-ға дейін ұлғайтылды. 1 аптадан соң ЭКГ қайталау."
    },
    scheduledCare: {
      careType: "Медбикелік патронаж",
      specialistName: "Меруерт Саматқызы",
      time: "Бүгін, сағат 14:00-де",
      task: "Қан қысымы мен ЭКГ өлшеу, дәрі қабылдауын бақылау"
    }
  },
  {
    id: "fam-2",
    name: "Айсұлу апай (Анасы)",
    relation: "Анасы",
    age: 68,
    gender: "Әйел",
    bloodType: "B(III) Rh+",
    diagnosis: "2-типті қант диабеті, отадан кейінгі оңалту",
    chronicConditions: ["Қант диабеті", "Варикоз"],
    allergies: ["Аспиринге аллергиясы бар"],
    lastVitals: {
      bloodPressure: "130/80",
      temperature: "36.6°C",
      pulse: "76",
      glucose: "6.8 ммоль/л",
      recordedAt: "Бүгін, сағат 08:00"
    },
    medications: [
      { name: "Метформин", dosage: "850 мг", timing: "Күніне 2 рет (таңертең және кешке)", notes: "Қант деңгейін реттеу" },
      { name: "Инсулин Лантус", dosage: "14 ЕД", timing: "Кешкі сағат 21:00-де", notes: "Тері астына егу" }
    ],
    doctorAdvice: "Қант пен көмірсуларды қатаң бақылау. Операциядан кейінгі жараны күнделікті тазалап таңу (перевязка).",
    lastDoctorVisit: {
      doctorName: "Др. Қасымова Әлия",
      specialty: "Терапевт",
      date: "02 қыркүйек 2026",
      conclusion: "Отадан кейінгі тігіс жақсы бітіп келеді. 5 күн бойы медбикелік жара таңу қажет."
    },
    scheduledCare: {
      careType: "Жара таңу (Перевязка)",
      specialistName: "Меруерт Саматқызы",
      time: "Бүгін, сағат 11:30",
      task: "Стерильді таңғышты ауыстыру, антисептикпен өңдеу"
    }
  },
  {
    id: "fam-3",
    name: "Батырхан (Баласы)",
    relation: "Баласы",
    age: 7,
    gender: "Ер",
    bloodType: "A(II) Rh+",
    diagnosis: "Жедел респираторлық аллергиялық бронхит",
    chronicConditions: ["Аллергиялық ринит"],
    allergies: ["Цитрус жемістері, шаң кенелері"],
    lastVitals: {
      bloodPressure: "105/65",
      temperature: "37.2°C",
      pulse: "88",
      recordedAt: "Бүгін, таңертең"
    },
    medications: [
      { name: "Амброксол шәрбаты", dosage: "5 мл", timing: "Күніне 3 рет тамақтан соң", notes: "Қақырық түсіру" },
      { name: "Фенистил тамшылары", dosage: "15 тамшы", timing: "Түнде ұйықтар алдында", notes: "Аллергияға қарсы" }
    ],
    doctorAdvice: "Бөлмені жиі желдетіп, ылғалдандыру. Жылы сұйықтық көп ішкізу. Қызуы 38.5°C-тан асса педиатр шақыру.",
    lastDoctorVisit: {
      doctorName: "Др. Омарова Зере",
      specialty: "Педиатр",
      date: "03 қыркүйек 2026",
      conclusion: "Өкпесінде сырыл жоқ. Аллергиялық сипаттағы жөтел."
    },
    scheduledCare: {
      careType: "Педиатр бақылауы",
      specialistName: "Др. Омарова Зере",
      time: "Ертең, сағат 16:00",
      task: "Тыңдап тексеру, динамиканы көру"
    }
  }
];
