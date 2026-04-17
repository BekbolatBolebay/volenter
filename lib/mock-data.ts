export const MOCK_TASKS = [
  {
    id: "t1",
    title: "Eco-Stream Cleanup",
    category: "Community Tech",
    xp: 450,
    description: "Digital coordination for cleaning the local river bank. We need 5 volunteers to mark heavy trash spots on the app.",
    status: "open" as const
  },
  {
    id: "t2",
    title: "Elderly Digital Onboarding",
    category: "EdTech",
    xp: 800,
    description: "Help seniors in Almaty set up their digital identity and government services apps.",
    status: "open" as const
  },
  {
    id: "t3",
    title: "MedTech Logistics Support",
    category: "MedTech",
    xp: 600,
    description: "Organizing medical supplies delivery routes for the regional hospital. High impact!",
    status: "open" as const
  }
];

export const MOCK_MARKETPLACE = [
  { id: "m1", title: "Kinopark Movie Ticket", brand: "Kinopark", cost_xp: 1500, is_active: true },
  { id: "m2", title: "Starbucks Coffee Coupon", brand: "Starbucks", cost_xp: 800, is_active: true },
  { id: "m3", title: "ChocoFood Promo Code", brand: "Choco", cost_xp: 1200, is_active: true },
  { id: "m4", title: "Gym Daily Pass", brand: "Invictus", cost_xp: 2000, is_active: true }
];

export const MOCK_PROFILE = {
  id: "hackathon-user",
  full_name: "Alem Volunteer",
  xp: 1250,
  badges: ["Active Citizen", "Digital Pioneer"],
  role: "volunteer",
  skills: [
    { name: 'PropTech & CityTech', level: 1, xp: 200, nextLevel: 1000, color: 'from-emerald-500 to-emerald-300' },
    { name: 'MedTech', level: 2, xp: 1100, nextLevel: 1500, color: 'from-blue-500 to-blue-300' },
    { name: 'LegalTech', level: 1, xp: 0, nextLevel: 1000, color: 'from-amber-500 to-amber-300' },
    { name: 'EdTech', level: 1, xp: 450, nextLevel: 1000, color: 'from-purple-500 to-purple-300' },
    { name: 'Community Tech', level: 1, xp: 150, nextLevel: 1000, color: 'from-rose-500 to-rose-300' }
  ]
};

export const MOCK_LEADERBOARD = [
  { id: "u1", name: "Alikhan Erlan", xp: 4500, level: 24, badges: 12, avatar: "AE" },
  { id: "u2", name: "Dana Sailaubek", xp: 3800, level: 20, badges: 10, avatar: "DS" },
  { id: "u3", name: "Madiyar K.", xp: 3200, level: 16, badges: 8, avatar: "MK" },
  { id: "u4", name: "Aigerim T.", xp: 2900, level: 14, badges: 7, avatar: "AT" },
  { id: "u5", name: "Erzhan M.", xp: 2500, level: 12, badges: 6, avatar: "EM" },
  { id: "u6", name: "Beglan A.", xp: 2100, level: 10, badges: 5, avatar: "BA" },
  { id: "u7", name: "Zhansaya Q.", xp: 1800, level: 9, badges: 4, avatar: "ZQ" },
];
