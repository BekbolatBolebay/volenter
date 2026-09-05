import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

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
  fetchFromSupabase: () => Promise<void>;
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
  }
];

export const useDispatchStore = create<DispatchStoreState>()(
  persist(
    (set, get) => ({
      requests: INITIAL_MOCK_REQUESTS,

      fetchFromSupabase: async () => {
        try {
          const { data, error } = await supabase.from('care_requests').select('*');
          if (!error && data && data.length > 0) {
            const mapped: CareRequest[] = data.map((r: any) => ({
              id: r.id,
              patientName: r.patient_name,
              patientAge: r.patient_age,
              phone: r.phone,
              address: r.address,
              coordinates: r.coordinates || [43.2389, 76.8897],
              careType: r.care_type,
              specialtyNeeded: r.specialty_needed,
              symptoms: r.symptoms,
              urgency: r.urgency,
              status: r.status,
              assignedSpecialistId: r.assigned_specialist_id,
              assignedSpecialistName: r.assigned_specialist_name,
              assignedSpecialistPhone: r.assigned_specialist_phone,
              specialistRole: r.specialist_role,
              notes: r.notes,
              vitalSigns: r.vital_signs,
              createdAt: r.created_at || 'Жаңа'
            }));
            set({ requests: mapped });
          }
        } catch (e) {
          console.warn('Supabase fetch notice:', e);
        }
      },

      createRequest: (newReqData) => {
        const newReq: CareRequest = {
          ...newReqData,
          id: `req-${Date.now()}`,
          status: 'pending',
          createdAt: 'Жаңа ғана'
        };

        // Update local state immediately
        set((state) => ({
          requests: [newReq, ...state.requests]
        }));

        // Async sync with Supabase
        try {
          supabase.from('care_requests').insert([
            {
              id: newReq.id,
              patient_name: newReq.patientName,
              patient_age: newReq.patientAge,
              phone: newReq.phone,
              address: newReq.address,
              coordinates: newReq.coordinates,
              care_type: newReq.careType,
              specialty_needed: newReq.specialtyNeeded,
              symptoms: newReq.symptoms,
              urgency: newReq.urgency,
              status: newReq.status
            }
          ]).then((res) => {
            if (res.error) console.warn('Supabase insert notice:', res.error.message);
          });
        } catch (err) {
          console.warn('Supabase insert exception:', err);
        }

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

        // Async sync with Supabase
        try {
          supabase.from('care_requests').update({
            status: 'accepted',
            assigned_specialist_id: specialist.id,
            assigned_specialist_name: specialist.name,
            assigned_specialist_phone: specialist.phone,
            specialist_role: specialist.role,
            notes: `${specialist.name} шақыртуды қабылдады.`
          }).eq('id', requestId).then((res) => {
            if (res.error) console.warn('Supabase update notice:', res.error.message);
          });
        } catch (err) {
          console.warn('Supabase update exception:', err);
        }
      },

      updateStatus: (requestId, status) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId ? { ...r, status } : r
          )
        }));

        // Async sync with Supabase
        try {
          supabase.from('care_requests').update({ status }).eq('id', requestId).then((res) => {
            if (res.error) console.warn('Supabase status update notice:', res.error.message);
          });
        } catch (err) {
          console.warn('Supabase status update exception:', err);
        }
      },

      updateVitals: (requestId, vitals) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId ? { ...r, vitalSigns: { ...r.vitalSigns, ...vitals } } : r
          )
        }));

        // Async sync with Supabase
        try {
          supabase.from('care_requests').update({ vital_signs: vitals }).eq('id', requestId).then((res) => {
            if (res.error) console.warn('Supabase vitals update notice:', res.error.message);
          });
        } catch (err) {
          console.warn('Supabase vitals update exception:', err);
        }
      },

      addDoctorNote: (requestId, note) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? { ...r, notes: r.notes ? `${r.notes}\n${note}` : note }
              : r
          )
        }));

        try {
          const req = get().requests.find((r) => r.id === requestId);
          if (req) {
            supabase.from('care_requests').update({ notes: req.notes }).eq('id', requestId).then((res) => {
              if (res.error) console.warn('Supabase note update notice:', res.error.message);
            });
          }
        } catch (err) {
          console.warn('Supabase note update exception:', err);
        }
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
