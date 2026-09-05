"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { EMERGENCY_FIRST_AID_GUIDES, FirstAidStep } from "@/lib/medical-data";
import { CareType } from "@/lib/dispatch-store";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ALEM_API_KEY = process.env.ALEM_API_KEY || "";
const KAZLLM_URL = "https://llm.alem.ai/v1/chat/completions";

export type TriageUrgency = "CRITICAL_RED" | "URGENT_YELLOW" | "NON_URGENT_GREEN";

export interface TriageResult {
  urgency: TriageUrgency;
  urgencyLabel: string;
  isEmergency103Required: boolean;
  emergencyConditionType?: 'HEART_ATTACK' | 'STROKE' | 'BLEEDING' | 'DEFAULT';
  careType: CareType;
  careTypeLabel: string;
  detectedSymptoms: string[];
  recommendedSpecialties: ('cardiologist' | 'therapist' | 'neurologist' | 'pediatrician' | 'traumatologist' | 'pulmonologist' | 'general')[];
  specialistTitleKazakh: string;
  responseMessage: string;
  firstAidAdvice: FirstAidStep[];
  disclaimer: string;
}

/**
 * Server action to evaluate medical & home care symptoms using Gemini 1.5 Flash
 */
export async function evaluateMedicalTriage(
  userQuery: string,
  chatHistory: { role: "user" | "model"; text: string }[] = []
): Promise<{ success: boolean; data: TriageResult }> {
  const defaultDisclaimer = "Ескерту: Бұл ақпарат тек алдын ала бағдарлауға арналған және ресми медициналық диагноз болып табылмайды. Төтенше жағдайда кідірместен 103 нөміріне хабарласыңыз.";

  // Fast-track rule-based detection for safety & specialist matching
  const queryLower = userQuery.toLowerCase();
  const isSevereChestPain = queryLower.includes("жүрек") && (queryLower.includes("қысып") || queryLower.includes("ауырып") || queryLower.includes("сол қол") || queryLower.includes("тыныс"));
  const isStrokeSigns = (queryLower.includes("инсульт") || queryLower.includes("бетім қисай") || queryLower.includes("сөйлей алмай") || queryLower.includes("қолым көтерілмей"));
  const isSevereBleeding = (queryLower.includes("қан тоқтамай") || queryLower.includes("қан ағып") || queryLower.includes("жарақат"));
  
  // Nurse detection
  const isNurseNeed = queryLower.includes("капельница") || queryLower.includes("укол") || queryLower.includes("инъекция") || queryLower.includes("жара") || queryLower.includes("перевязка") || queryLower.includes("таңу") || queryLower.includes("инсулин");

  // Psychologist detection
  const isPsychNeed = queryLower.includes("психолог") || queryLower.includes("стресс") || queryLower.includes("депрессия") || queryLower.includes("үрей") || queryLower.includes("паника") || queryLower.includes("қорқыныш") || queryLower.includes("жүйке") || queryLower.includes("шаршадым") || queryLower.includes("бағып жүріп");

  if (!GEMINI_API_KEY && !ALEM_API_KEY) {
    // Intelligent offline fallback
    if (isSevereChestPain) {
      return {
        success: true,
        data: {
          urgency: "CRITICAL_RED",
          urgencyLabel: "Өте қауіпті (Шұғыл 103 қажет)",
          isEmergency103Required: true,
          emergencyConditionType: "HEART_ATTACK",
          careType: "emergency",
          careTypeLabel: "🚨 103 Жедел жәрдем шақыру",
          detectedSymptoms: ["Кеуде қысылуы", "Жүрек ауруы"],
          recommendedSpecialties: ["cardiologist"],
          specialistTitleKazakh: "Шұғыл кардиолог / Жедел жәрдем тобы",
          responseMessage: "⚠️ НАЗАР АУДАРЫҢЫЗ! Кеуденің қатты қысылуы немесе жүрек тұсының ауыруы инфаркт қаупін білдіруі мүмкін. Дереу 103 Жедел жәрдем шақырыңыз!",
          firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.HEART_ATTACK,
          disclaimer: defaultDisclaimer
        }
      };
    }

    if (isStrokeSigns) {
      return {
        success: true,
        data: {
          urgency: "CRITICAL_RED",
          urgencyLabel: "Өте қауіпті (Инсульт қаупі - 103)",
          isEmergency103Required: true,
          emergencyConditionType: "STROKE",
          careType: "emergency",
          careTypeLabel: "🚨 103 Жедел жәрдем шақыру",
          detectedSymptoms: ["Бет қисаюы", "Сөйлеудің бұзылуы", "Қол әлсіздігі"],
          recommendedSpecialties: ["neurologist"],
          specialistTitleKazakh: "Шұғыл невролог / Реанимациялық 103",
          responseMessage: "🚨 ДЕРЕУ 103 ШАҚЫРЫҢЫЗ! Сипатталған белгілер жедел ми қан айналымының бұзылуын (инсульт) білдіреді.",
          firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.STROKE,
          disclaimer: defaultDisclaimer
        }
      };
    }

    if (isNurseNeed) {
      return {
        success: true,
        data: {
          urgency: "NON_URGENT_GREEN",
          urgencyLabel: "Патронаждық көмек",
          isEmergency103Required: false,
          careType: "nurse",
          careTypeLabel: "💉 Медбике қызметі (Үйге шақыру)",
          detectedSymptoms: ["Процедуралық қажеттілік"],
          recommendedSpecialties: ["general"],
          specialistTitleKazakh: "Үйге баратын білікті медбике",
          responseMessage: "Сіздің сұранысыңыз бойынша дәрігердің тағайындауымен капельница қою, инъекция жасау немесе жара таңу үшін білікті медбике шақыру рәсімдеуге болады.",
          firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.DEFAULT,
          disclaimer: defaultDisclaimer
        }
      };
    }

    if (isPsychNeed) {
      return {
        success: true,
        data: {
          urgency: "NON_URGENT_GREEN",
          urgencyLabel: "Психологиялық қолдау",
          isEmergency103Required: false,
          careType: "psychologist",
          careTypeLabel: "🧠 Психолог кеңесі",
          detectedSymptoms: ["Эмоционалдық күйзеліс", "Үрей / Шаршау"],
          recommendedSpecialties: ["general"],
          specialistTitleKazakh: "Клиникалық & Кризистік психолог",
          responseMessage: "Үйдегі науқасқа күтім жасау немесе созылмалы ауру жағдайы адамның психоэмоционалдық денсаулығына ауыр салмақ түсіреді. Сізге білікті психологтың жедел кеңесі немесе үйге келу сессиясы ұсынылады.",
          firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.DEFAULT,
          disclaimer: defaultDisclaimer
        }
      };
    }

    // Default Doctor Visit
    return {
      success: true,
      data: {
        urgency: "URGENT_YELLOW",
        urgencyLabel: "Дәрігердің қарауы қажет",
        isEmergency103Required: false,
        careType: "doctor",
        careTypeLabel: "🩺 Дәрігерді үйге шақыру",
        detectedSymptoms: ["Жалпы шағымдар"],
        recommendedSpecialties: ["therapist"],
        specialistTitleKazakh: "Терапевт / Жалпы тәжірибелік дәрігер",
        responseMessage: "Үйдегі науқастың жағдайын толық бағалау және ем тағайындау үшін білікті дәрігерді үйге шақыру ұсынылады. Біздің жүйе арқылы дәрігер үйге келіп, науқасты тексереді.",
        firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.DEFAULT,
        disclaimer: defaultDisclaimer
      }
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
You are a MedTech HomeCare & Triage AI Dispatcher.
You serve patients, bedridden patients, and family caregivers needing home medical assistance.

Classify the user's situation into:
1. careType:
   - "emergency": life threats (chest pressure, stroke signs, massive bleeding, asphyxia) -> 103
   - "doctor": needs medical diagnosis, exam, prescription at home (therapist, cardiologist, pediatrician, etc.)
   - "nurse": needs medical procedures at home (IV drip, intramuscular/intravenous injections, surgical dressing, catheter care, vital check)
   - "psychologist": emotional distress, panic attack, anxiety, depression, or caregiver burnout (family caring for severe patient)

2. urgency:
   - "CRITICAL_RED": immediate 103 call
   - "URGENT_YELLOW": acute discomfort, needs same-day visit
   - "NON_URGENT_GREEN": routine procedure, scheduled therapy, nurse care

Return ONLY a valid JSON:
{
  "urgency": "CRITICAL_RED" | "URGENT_YELLOW" | "NON_URGENT_GREEN",
  "urgencyLabel": "Қазақша қысқа сипаттама",
  "isEmergency103Required": boolean,
  "emergencyConditionType": "HEART_ATTACK" | "STROKE" | "BLEEDING" | "DEFAULT",
  "careType": "doctor" | "nurse" | "psychologist" | "emergency",
  "careTypeLabel": "Қазақша атауы (мысалы: 'Дәрігерді үйге шақыру' немесе 'Медбике (капельница/укол)')",
  "detectedSymptoms": ["анықталған симптомдар қазақша"],
  "recommendedSpecialties": ["cardiologist" | "therapist" | "neurologist" | "pediatrician" | "traumatologist" | "pulmonologist" | "general"],
  "specialistTitleKazakh": "Ұсынылатын маман (мысалы: 'Терапевт-дәрігер' немесе 'Патронаждық медбике')",
  "responseMessage": "Жылы, жанашыр, кәсіби қазақ тіліндегі жауап пен нақты нұсқау",
  "firstAidAdvice": [
    {
      "title": "Қадам атауы",
      "instruction": "Нақты нұсқаулық",
      "criticalDoNot": "Не істеуге мүлдем болмайды"
    }
  ]
}
`;

    const userPrompt = `
Науқас немесе туысының сұранысы: "${userQuery}"
Диалог тарихы: ${JSON.stringify(chatHistory.slice(-4))}
Жоғарыдағы талап бойынша JSON түрінде ғана жауап беріңіз.
`;

    const result = await model.generateContent([systemPrompt, userPrompt]);
    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return {
      success: true,
      data: {
        ...parsed,
        disclaimer: defaultDisclaimer
      }
    };
  } catch (err) {
    console.error("Gemini Medical Triage Error, using heuristics:", err);
    const isRed = isSevereChestPain || isStrokeSigns || isSevereBleeding;
    const careType: CareType = isRed ? "emergency" : isNurseNeed ? "nurse" : isPsychNeed ? "psychologist" : "doctor";

    return {
      success: true,
      data: {
        urgency: isRed ? "CRITICAL_RED" : "URGENT_YELLOW",
        urgencyLabel: isRed ? "Шұғыл 103 қажет" : "Маманның үйге келуі қажет",
        isEmergency103Required: isRed,
        emergencyConditionType: isSevereChestPain ? "HEART_ATTACK" : isStrokeSigns ? "STROKE" : isSevereBleeding ? "BLEEDING" : "DEFAULT",
        careType,
        careTypeLabel: careType === "emergency" ? "🚨 103 Жедел жәрдем" : careType === "nurse" ? "💉 Медбике (укол/капельница)" : careType === "psychologist" ? "🧠 Психолог кеңесі" : "🩺 Дәрігерді үйге шақыру",
        detectedSymptoms: ["Шағым тіркелді"],
        recommendedSpecialties: isSevereChestPain ? ["cardiologist"] : ["therapist"],
        specialistTitleKazakh: isRed ? "Шұғыл дәрігер" : careType === "nurse" ? "Патронаждық медбике" : careType === "psychologist" ? "Клиникалық психолог" : "Терапевт",
        responseMessage: isRed
          ? "🚨 НАЗАР АУДАРЫҢЫЗ! Бұл жағдайда кідірместен 103 Жедел жәрдем шақырылуы қажет!"
          : "Сұранысыңыз жүйеде тіркелді. Төмендегі батырма арқылы үйге маман шақыртуды бірден рәсімдей аласыз.",
        firstAidAdvice: isSevereChestPain ? EMERGENCY_FIRST_AID_GUIDES.HEART_ATTACK : EMERGENCY_FIRST_AID_GUIDES.DEFAULT,
        disclaimer: defaultDisclaimer
      }
    };
  }
}
