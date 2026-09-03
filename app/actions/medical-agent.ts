"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { EMERGENCY_FIRST_AID_GUIDES, FirstAidStep } from "@/lib/medical-data";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ALEM_API_KEY = process.env.ALEM_API_KEY || "";
const KAZLLM_URL = "https://llm.alem.ai/v1/chat/completions";

export type TriageUrgency = "CRITICAL_RED" | "URGENT_YELLOW" | "NON_URGENT_GREEN";

export interface TriageResult {
  urgency: TriageUrgency;
  urgencyLabel: string;
  isEmergency103Required: boolean;
  emergencyConditionType?: 'HEART_ATTACK' | 'STROKE' | 'BLEEDING' | 'DEFAULT';
  detectedSymptoms: string[];
  recommendedSpecialties: ('cardiologist' | 'therapist' | 'neurologist' | 'pediatrician' | 'traumatologist' | 'pulmonologist' | 'general')[];
  specialistTitleKazakh: string;
  responseMessage: string;
  firstAidAdvice: FirstAidStep[];
  disclaimer: string;
}

/**
 * Server action to evaluate medical symptoms using Gemini 1.5 Flash
 */
export async function evaluateMedicalTriage(
  userQuery: string,
  chatHistory: { role: "user" | "model"; text: string }[] = []
): Promise<{ success: boolean; data: TriageResult }> {
  const defaultDisclaimer = "Ескерту: Бұл ақпарат тек алдын ала бағдарлауға арналған және ресми медициналық диагноз болып табылмайды. Төтенше жағдайда кідірместен 103 нөміріне хабарласыңыз.";

  // Fast-track rule-based emergency detection for safety
  const queryLower = userQuery.toLowerCase();
  const isSevereChestPain = queryLower.includes("жүрек") && (queryLower.includes("қысып") || queryLower.includes("ауырып") || queryLower.includes("сол қол") || queryLower.includes("тыныс"));
  const isStrokeSigns = (queryLower.includes("инсульт") || queryLower.includes("бетім қисай") || queryLower.includes("сөйлей алмай") || queryLower.includes("қолым көтерілмей"));
  const isSevereBleeding = (queryLower.includes("қан тоқтамай") || queryLower.includes("қан ағып") || queryLower.includes("жарақат"));

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
          detectedSymptoms: ["Кеуде қысылуы", "Жүрек ауруы"],
          recommendedSpecialties: ["cardiologist"],
          specialistTitleKazakh: "Шұғыл кардиолог / Жедел жәрдем тобы",
          responseMessage: "⚠️ НАЗАР АУДАРЫҢЫЗ! Кеуденің қатты қысылуы немесе жүрек тұсының ауыруы жүрек-қан тамырларының шұғыл жағдайын (инфаркт қаупін) көрсетуі мүмкін. Дереу 103 Жедел жәрдем шақырыңыз!",
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
          detectedSymptoms: ["Бет қисаюы", "Сөйлеудің бұзылуы", "Қол әлсіздігі"],
          recommendedSpecialties: ["neurologist"],
          specialistTitleKazakh: "Шұғыл невролог / Реанимациялық 103",
          responseMessage: "🚨 ДЕРЕУ 103 ШАҚЫРЫҢЫЗ! Сипатталған белгілер жедел ми қан айналымының бұзылуын (инсульт) білдіреді. Науқасқа дереу жедел жәрдем қажет!",
          firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.STROKE,
          disclaimer: defaultDisclaimer
        }
      };
    }

    if (isSevereBleeding) {
      return {
        success: true,
        data: {
          urgency: "CRITICAL_RED",
          urgencyLabel: "Шұғыл көмек қажет (103)",
          isEmergency103Required: true,
          emergencyConditionType: "BLEEDING",
          detectedSymptoms: ["Қан кету", "Ауыр жарақат"],
          recommendedSpecialties: ["traumatologist"],
          specialistTitleKazakh: "Травматолог-хирург",
          responseMessage: "Қан кетуді шұғыл тоқтату қажет. Таза шүберекпен басып, дереу 103 нөміріне қоңырау шалыңыз.",
          firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.BLEEDING,
          disclaimer: defaultDisclaimer
        }
      };
    }

    // Standard fallback
    return {
      success: true,
      data: {
        urgency: "NON_URGENT_GREEN",
        urgencyLabel: "Жоспарлы қаралу (Төтенше қауіп жоқ)",
        isEmergency103Required: false,
        detectedSymptoms: ["Жалпы шағымдар"],
        recommendedSpecialties: ["therapist"],
        specialistTitleKazakh: "Жалпы тәжірибелік дәрігер (Терапевт)",
        responseMessage: "Шағымдарыңызға сәйкес, жағдайыңызды нақтылау үшін ең алдымен білікті терапевтке немесе отбасылық дәрігерге қаралғаныңыз жөн. Төмендегі картадан жақын орналасқан дәрігерлерді көре аласыз.",
        firstAidAdvice: EMERGENCY_FIRST_AID_GUIDES.DEFAULT,
        disclaimer: defaultDisclaimer
      }
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
You are a Medical Triage & Patient Safety AI Dispatcher for a healthcare platform.
Your goal is to evaluate patient symptoms, determine urgency level, identify red flags for immediate emergency 103 (Ambulance), advise recommended medical doctor specialties, and provide reassuring first aid instructions in Kazakh.

CRITICAL SAFETY PROTOCOL:
- If symptoms indicate life threats (e.g. acute chest pressure radiating to arm/jaw, FAST stroke signs like facial droop or slurred speech, massive bleeding, severe choking, acute anaphylaxis, loss of consciousness), MUST assign urgency: "CRITICAL_RED" and isEmergency103Required: true.
- If symptoms are severe but not immediately fatal (fever >39C, severe abdominal pain, possible bone fracture): "URGENT_YELLOW" and isEmergency103Required: false.
- If mild/routine (cold, minor headache, seasonal rash): "NON_URGENT_GREEN" and isEmergency103Required: false.

Return ONLY a valid JSON with this structure:
{
  "urgency": "CRITICAL_RED" | "URGENT_YELLOW" | "NON_URGENT_GREEN",
  "urgencyLabel": "Қазақша қысқа сипаттама (мысалы: 'Өте қауіпті (Шұғыл 103 қажет)')",
  "isEmergency103Required": boolean,
  "emergencyConditionType": "HEART_ATTACK" | "STROKE" | "BLEEDING" | "DEFAULT",
  "detectedSymptoms": ["анықталған симптомдар қазақша"],
  "recommendedSpecialties": ["cardiologist" | "therapist" | "neurologist" | "pediatrician" | "traumatologist" | "pulmonologist" | "general"],
  "specialistTitleKazakh": "Ұсынылатын дәрігер (мысалы: 'Кардиолог' немесе 'Терапевт')",
  "responseMessage": "Жылы, кәсіби, түсінікті қазақ тіліндегі жауап пен кеңес",
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
Науқас шағымы: "${userQuery}"
Диалог тарихы: ${JSON.stringify(chatHistory.slice(-4))}
Жоғарыдағы талаптар бойынша JSON форматында ғана жауап беріңіз.
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
    console.error("Gemini Medical Triage Error, using safe heuristics:", err);
    // Safe heuristic fallback
    const isRed = isSevereChestPain || isStrokeSigns || isSevereBleeding;
    return {
      success: true,
      data: {
        urgency: isRed ? "CRITICAL_RED" : "URGENT_YELLOW",
        urgencyLabel: isRed ? "Шұғыл көмек (103)" : "Маман кеңесі қажет",
        isEmergency103Required: isRed,
        emergencyConditionType: isSevereChestPain ? "HEART_ATTACK" : isStrokeSigns ? "STROKE" : isSevereBleeding ? "BLEEDING" : "DEFAULT",
        detectedSymptoms: ["Шағым тіркелді"],
        recommendedSpecialties: isSevereChestPain ? ["cardiologist"] : isStrokeSigns ? ["neurologist"] : ["therapist"],
        specialistTitleKazakh: isSevereChestPain ? "Кардиолог" : isStrokeSigns ? "Невропатолог" : "Терапевт",
        responseMessage: isRed
          ? "🚨 НАЗАР АУДАРЫҢЫЗ! Жағдайыңыз шұғыл дәрігерлік көмекті талап етеді. Кідірместен 103 Жедел жәрдем шақырыңыз!"
          : "Симптомдарыңызды мұқият тексеру үшін төменде көрсетілген мамандардың біріне қаралғаныңыз абзал.",
        firstAidAdvice: isSevereChestPain ? EMERGENCY_FIRST_AID_GUIDES.HEART_ATTACK : EMERGENCY_FIRST_AID_GUIDES.DEFAULT,
        disclaimer: defaultDisclaimer
      }
    };
  }
}
