import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_TASKS, MOCK_MARKETPLACE, MOCK_PROFILE } from './mock-data';

export interface Task {
  id: string;
  title: string;
  category: string;
  xp: number;
  description: string;
  status: 'open' | 'in-progress' | 'completed';
}

export interface Skill {
  name: string;
  level: number;
  xp: number;
  nextLevel: number;
  color: string;
}

interface AppState {
  xp: number;
  badges: string[];
  tasks: Task[];
  skills: Skill[];
  impactData: { name: string; impact: number }[];
  marketplace: any[];
  user: {
    name: string;
    email: string;
    location: string;
    avatar?: string;
    memberSince: string;
  };
  addXP: (amount: number, category: string) => void;
  updateProfile: (profile: Partial<AppState['user']>) => void;
  createTask: (task: Omit<Task, 'id' | 'status'>) => void;
  completeTask: (taskId: string) => void;
  resetTasks: () => void;
  buyFromMarketplace: (cost: number, id: string) => boolean;
  fetchInitialData: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      xp: MOCK_PROFILE.xp,
      badges: MOCK_PROFILE.badges,
      tasks: MOCK_TASKS,
      skills: MOCK_PROFILE.skills,
      impactData: [
        { name: 'Jan', impact: 120 },
        { name: 'Feb', impact: 450 },
        { name: 'Mar', impact: 300 },
        { name: 'Apr', impact: 600 },
        { name: 'May', impact: 800 },
        { name: 'Jun', impact: 1100 },
      ],
      marketplace: MOCK_MARKETPLACE,
      user: {
        name: "Alem Volunteer",
        email: "volunteer@alem.ai",
        location: "Almaty, KZ",
        memberSince: "March 12, 2026",
      },

      fetchInitialData: async () => {
        // Since we use persist, the data is already in localStorage.
        // We only populate if empty.
        if (get().tasks.length === 0) {
          set({ 
            tasks: MOCK_TASKS, 
            marketplace: MOCK_MARKETPLACE,
            xp: MOCK_PROFILE.xp,
            badges: MOCK_PROFILE.badges,
            skills: MOCK_PROFILE.skills
          });
        }
      },
      
      resetTasks: () => {
        set({ tasks: MOCK_TASKS });
      },
      
      addXP: (amount, category) => {
        set((state) => {
          const newXp = state.xp + amount;
          const newBadges = [...state.badges];
          if (newXp >= 3000 && !newBadges.includes('City Defender')) {
            newBadges.push('City Defender');
          }

          const newSkills = state.skills.map((skill) => {
            if (skill.name === category) {
              const newSkillXp = skill.xp + amount;
              let newLevel = skill.level;
              let nxtLvl = skill.nextLevel;
              if (newSkillXp >= skill.nextLevel) {
                newLevel += 1;
                nxtLvl = Math.floor(nxtLvl * 1.5);
              }
              return { ...skill, xp: newSkillXp, level: newLevel, nextLevel: nxtLvl };
            }
            return skill;
          });

          const updatedImpactData = [...state.impactData];
          const lastIndex = updatedImpactData.length - 1;
          updatedImpactData[lastIndex] = {
            ...updatedImpactData[lastIndex],
            impact: updatedImpactData[lastIndex].impact + amount / 10
          };

          return { xp: newXp, badges: newBadges, skills: newSkills, impactData: updatedImpactData };
        });
      },

      createTask: (task) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: Math.random().toString(36).substr(2, 9), status: 'open' }
          ]
        }));
      },

      completeTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (task && task.status === 'open') {
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
          }));
          get().addXP(task.xp, task.category);
        }
      },

      buyFromMarketplace: (cost, id) => {
        const currentXp = get().xp;
        if (currentXp >= cost) {
          set({ xp: currentXp - cost });
          return true;
        }
        return false;
      },

      updateProfile: (profileData) => {
        set((state) => ({
          user: { ...state.user, ...profileData }
        }));
      }
    }),
    {
      name: 'alem-volunteer-storage',
    }
  )
);
