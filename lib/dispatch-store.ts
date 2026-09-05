import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CareType = 'doctor' | 'nurse' | 'psychologist' | 'emergency';
export type RequestStatus = 'pending' | 'accepted' | 'en_route' | 'completed' | 'cancelled';
export type UrgencyLevel = 'CRITICAL_RED' | 'URGENT_YELLOW' | 'NON_URGENT_GREEN';

export interface CareRequest {
  id: string;
  patientName: string;
  patientAge: number;
  phone: string;
  address: string;
  coordinates: [number, number];
  careType: CareType;
  specialtyNeeded: string;
  symptoms: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  assignedSpecialistId?: string;
  assignedSpecialistName?: string;
  assignedSpecialistPhone?: string;
  specialistRole?: string;
  notes?: string;
  vitalSigns?: {
    bloodPressure?: string;
    temperature?: string;
    pulse?: string;
  };
  createdAt: string;
}

interface DispatchStoreState {
  requests: CareRequest[];
  createRequest: (request: Omit<CareRequest, 'id' | 'createdAt' | 'status'>) => CareRequest;
  acceptRequest: (requestId: string, specialist: { id: string; name: string; phone: string; role: string }) => void;
  updateStatus: (requestId: string, status: RequestStatus) => void;
  updateVitals: (requestId: string, vitals: CareRequest['vitalSigns']) => void;
  addDoctorNote: (requestId: string, note: string) => void;
  resetToDefaults: () => void;
}

export const INITIAL_MOCK_REQUESTS: CareRequest[] = [
  {
    id: 'req-101',
    patientName: 'Қалиев Серікбол ақсақал',
    patientAge: 74,
    phone: '+7 (701) 234-56-78',
    address: 'Алматы қ., Абай даңғылы, 140, 24-пәтер',
    coordinates: [43.2395, 76.9120],
    careType: 'doctor',
    specialtyNeeded: 'Кардиолог / Терапевт',
    symptoms: 'Созылмалы жүрек жеткіліксіздігі, қан қысымы 170/100 көтеріліп, ентігу мазалап тұр. Төсектен тұруы қиын.',
    urgency: 'URGENT_YELLOW',
    status: 'en_route',
    assignedSpecialistId: 'doc-1',
    assignedSpecialistName: 'Др. Сейітқали Айдос',
    assignedSpecialistPhone: '+7 (727) 279-01-01',
    specialistRole: 'Кардиолог (Жоғары санат)',
    notes: 'Дәрігер жолда. Шамамен 10 минутта жетеді.',
    vitalSigns: { bloodPressure: '170/100', temperature: '36.8°C', pulse: '92' },
    createdAt: 'Бүгін, 10:15'
  },
  {
    id: 'req-102',
    patientName: 'Жұмабаева Айсұлу',
    patientAge: 58,
    phone: '+7 (777) 345-67-89',
    address: 'Алматы қ., Төле би көшесі, 85, 12-пәтер',
    coordinates: [43.2530, 76.9290],
    careType: 'nurse',
    specialtyNeeded: 'Медбике (Патронаж)',
    symptoms: 'Операциядан кейінгі жараны таңу (перевязка), дәрігер жазып берген антибиотик пен витаминді капельницамен құю қажет.',
    urgency: 'NON_URGENT_GREEN',
    status: 'pending',
    createdAt: 'Бүгін, 11:30'
  },
  {
    id: 'req-103',
    patientName: 'Маратұлы Ерлан (науқастың ұлы)',
    patientAge: 42,
    phone: '+7 (705) 555-12-34',
    address: 'Алматы қ., Достық даңғылы, 105',
    coordinates: [43.2420, 76.9580],
    careType: 'psychologist',
    specialtyNeeded: 'Клиникалық психолог',
    symptoms: 'Инсульт алған анасын 6 айдан бері үйде бағып отырған отбасы мүшесінің күйзелісі (Caregiver burnout), паникалық қорқыныш, ұйқысыздық.',
    urgency: 'NON_URGENT_GREEN',
    status: 'accepted',
    assignedSpecialistId: 'psy-1',
    assignedSpecialistName: 'Әсем Нұрланқызы',
    assignedSpecialistPhone: '+7 (702) 888-99-00',
    specialistRole: 'Кризистік психолог',
    notes: 'Сағат 15:00-де үйге бару сессиясы келісілді.',
    createdAt: 'Бүгін, 09:45'
  },
  {
    id: 'req-104',
    patientName: 'Ермекқызы Дана',
    patientAge: 68,
    phone: '+7 (708) 111-22-33',
    address: 'Алматы қ., Жандосов көшесі, 22, 5-пәтер',
    coordinates: [43.2280, 76.9180],
    careType: 'nurse',
    specialtyNeeded: 'Медбике',
    symptoms: 'Күнделікті инсулин егу және қант деңгейін (глюкометрмен) өлшеу.',
    urgency: 'NON_URGENT_GREEN',
    status: 'completed',
    assignedSpecialistId: 'nurse-2',
    assignedSpecialistName: 'Меруерт Саматқызы',
    assignedSpecialistPhone: '+7 (700) 444-55-66',
    specialistRole: 'Жоғары санатты медбике',
    notes: 'Қант деңгейі 6.2 ммоль/л. Процедура сәтті орындалды.',
    vitalSigns: { bloodPressure: '125/80', temperature: '36.6°C', pulse: '74' },
    createdAt: 'Бүгін, 08:30'
  }
];

export const useDispatchStore = create<DispatchStoreState>()(
  persist(
    (set, get) => ({
      requests: INITIAL_MOCK_REQUESTS,

      createRequest: (newReqData) => {
        const newReq: CareRequest = {
          ...newReqData,
          id: `req-${Date.now()}`,
          status: 'pending',
          createdAt: 'Жаңа ғана'
        };
        set((state) => ({
          requests: [newReq, ...state.requests]
        }));
        return newReq;
      },

      acceptRequest: (requestId, specialist) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: 'accepted',
                  assignedSpecialistId: specialist.id,
                  assignedSpecialistName: specialist.name,
                  assignedSpecialistPhone: specialist.phone,
                  specialistRole: specialist.role,
                  notes: `${specialist.name} (${specialist.role}) шақыртуды қабылдады.`
                }
              : r
          )
        }));
      },

      updateStatus: (requestId, status) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId ? { ...r, status } : r
          )
        }));
      },

      updateVitals: (requestId, vitals) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId ? { ...r, vitalSigns: { ...r.vitalSigns, ...vitals } } : r
          )
        }));
      },

      addDoctorNote: (requestId, note) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? { ...r, notes: r.notes ? `${r.notes}\n${note}` : note }
              : r
          )
        }));
      },

      resetToDefaults: () => {
        set({ requests: INITIAL_MOCK_REQUESTS });
      }
    }),
    {
      name: 'medtech-dispatch-storage'
    }
  )
);
