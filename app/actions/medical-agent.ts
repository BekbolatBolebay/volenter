"use server";

import { EMERGENCY_FIRST_AID_GUIDES, FirstAidStep } from "@/lib/medical-data";
import { CareType } from "@/lib/dispatch-store";

const ALEM_LLM_URL = process.env.ALEM_LLM_URL || "https://llm.alem.ai/v1/chat/completions";
const GEMMA4_API_KEY = process.env.GEMMA4_API_KEY || "sk-fRTCBpsPEHKVIsK2pvbnxA";
const ALEMLLM_API_KEY = process.env.ALEMLLM_API_KEY || "sk-I8agzhli09Od5WbFynXkyA";
const KAZLLM_API_KEY = process.env.KAZLLM_API_KEY || "sk-ASh5s46If2OG6lwXgUhE-A";

export type TriageUrgency = "CRITICAL_RED" | "URGENT_YELLOW" | "NON_URGENT_GREEN";

export interface TriageResult {
  urgency: TriageUrgency;
  urgencyLabel: string;
  isEmergency103Required: boolean;
  emergencyConditionType?: "HEART_ATTACK" | "STROKE" | "BLEEDING" | "DEFAULT";
  careType: CareType;
  careTypeLabel: string;
  detectedSymptoms: string[];
  recommendedSpecialties: (
    | "cardiologist"
    | "therapist"
    | "neurologist"
    | "pediatrician"
    | "traumatologist"
    | "pulmonologist"
    | "general"
  )[];
  specialistTitleKazakh: string;
  responseMessage: string;
  firstAidAdvice: FirstAidStep[];
  disclaimer: string;
  modelUsed?: string;
}

/**
 * Call Alem.ai LLM endpoint with specified model and API key
 */
async function callAlemLLM(model: "gemma4" | "alemllm" | "kazllm", apiKey: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch(ALEM_LLM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    }),
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`AlemLLM API call failed for ${model}: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || "";
}

/**
 * Server action to evaluate medical & home care symptoms using Alem.ai models:
 * 1. Gemma 4 (Advanced Reasoning & Structured Triage)
 * 2. AlemLLM (247B MoE for native Kazakh response)
 * 3. KazLLM (Llama 3.1 Fallback)
 */
export async function evaluateMedicalTriage(
  userQuery: string,
  chatHistory: { role: "user" | "model"; text: string }[] = []
): Promise<{ success: boolean; data: TriageResult }> {
  const defaultDisclaimer =
    "Ескерту: Бұл ақпарат тек алдын ала бағдарлауға арналған және ресми медициналық диагноз болып табылмайды. Төтенше жағдайда кідірместен 103 нөміріне хабарласыңыз.";

  // Fast-track rule-based emergency & care detection for safety
  const queryLower = userQuery.toLowerCase();
  const isSevereChestPain =
    queryLower.includes("жүрек") &&
    (queryLower.includes("қысып") || queryLower.includes("ауырып") || queryLower.includes("сол қол") || queryLower.includes("тыныс"));
  const isStrokeSigns =
    queryLower.includes("инсульт") ||
    queryLower.includes("бетім қисай") ||
    queryLower.includes("сөйлей алмай") ||
    queryLower.includes("қолым көтерілмей");
  const isSevereBleeding = queryLower.includes("қан тоқтамай") || queryLower.includes("қан ағып") || queryLower.includes("жарақат");
  const isNurseNeed =
    queryLower.includes("капельница") ||
    queryLower.includes("укол") ||
    queryLower.includes("инъекция") ||
    queryLower.includes("жара") ||
    queryLower.includes("перевязка") ||
    queryLower.includes("таңу") ||
    queryLower.includes("инсулин");
  const isPsychNeed =
    queryLower.includes("психолог") ||
    queryLower.includes("стресс") ||
    queryLower.includes("депрессия") ||
    queryLower.includes("үрей") ||
    queryLower.includes("паника") ||
    queryLower.includes("қорқыныш") ||
    queryLower.includes("жүйке") ||
    queryLower.includes("шаршадым") ||
    queryLower.includes("бағып жүріп");

  const systemPrompt = `
You are MedTech HomeCare & Triage AI Dispatcher.
You serve patients, bedridden patients, and family caregivers in Kazakhstan.

Classify the user's situation into:
1. careType:
   - "emergency": life threats (acute chest pain radiating to arm, FAST stroke signs, heavy bleeding, loss of consciousness, choking) -> 103
   - "doctor": needs medical diagnosis, examination, prescription at home (therapist, cardiologist, pediatrician, etc.)
   - "nurse": needs procedures at home (IV drip, injections, surgical wound dressing, catheter care, blood pressure/glucose check)
   - "psychologist": emotional distress, panic attack, anxiety, depression, or caregiver burnout (family caring for severe patient)

2. urgency:
   - "CRITICAL_RED": immediate 103 call
   - "URGENT_YELLOW": acute discomfort, needs same-day visit
   - "NON_URGENT_GREEN": routine procedure, scheduled therapy, nurse care

Return ONLY a valid JSON object without markdown formatting:
{
  "urgency": "CRITICAL_RED" | "URGENT_YELLOW" | "NON_URGENT_GREEN",
  "urgencyLabel": "Қазақша қысқа сипаттама (мысалы: 'Шұғыл 103 қажет' немесе 'Үйге дәрігер шақыру')",
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
Науқас немесе отбасы мүшесінің шағымы: "${userQuery}"
Диалог тарихы: ${JSON.stringify(chatHistory.slice(-4))}
`;

  // Step 1: Try Gemma 4 for structured medical reasoning
  try {
    const rawText = await callAlemLLM("gemma4", GEMMA4_API_KEY, systemPrompt, userPrompt);
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return {
      success: true,
      data: {
        ...parsed,
        disclaimer: defaultDisclaimer,
        modelUsed: "Gemma 4 (Google) via Alem.ai"
      }
    };
  } catch (gemmaErr) {
    console.warn("Gemma 4 call failed, attempting AlemLLM (Astana Hub 247B MoE):", gemmaErr);

    // Step 2: Fallback to AlemLLM
    try {
      const rawText = await callAlemLLM("alemllm", ALEMLLM_API_KEY, systemPrompt, userPrompt);
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      return {
        success: true,
        data: {
          ...parsed,
          disclaimer: defaultDisclaimer,
          modelUsed: "AlemLLM (Astana Hub 247B MoE)"
        }
      };
    } catch (alemErr) {
      console.warn("AlemLLM call failed, attempting KazLLM (ISSAI):", alemErr);

      // Step 3: Fallback to KazLLM
      try {
        const rawText = await callAlemLLM("kazllm", KAZLLM_API_KEY, systemPrompt, userPrompt);
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        return {
          success: true,
          data: {
            ...parsed,
            disclaimer: defaultDisclaimer,
            modelUsed: "KazLLM (ISSAI Llama 3.1)"
          }
        };
      } catch (kazErr) {
        console.error("All Alem.ai models failed, using safe offline heuristics:", kazErr);
      }
    }
  }

  // Step 4: Intelligent Safe Offline Heuristic Fallback
  const isRed = isSevereChestPain || isStrokeSigns || isSevereBleeding;
  const careType: CareType = isRed ? "emergency" : isNurseNeed ? "nurse" : isPsychNeed ? "psychologist" : "doctor";

  return {
    success: true,
    data: {
      urgency: isRed ? "CRITICAL_RED" : "URGENT_YELLOW",
      urgencyLabel: isRed ? "Шұғыл 103 қажет" : "Маманның үйге келуі қажет",
      isEmergency103Required: isRed,
      emergencyConditionType: isSevereChestPain
        ? "HEART_ATTACK"
        : isStrokeSigns
        ? "STROKE"
        : isSevereBleeding
        ? "BLEEDING"
        : "DEFAULT",
      careType,
      careTypeLabel:
        careType === "emergency"
          ? "🚨 103 Жедел жәрдем"
          : careType === "nurse"
          ? "💉 Медбике (укол/капельница)"
          : careType === "psychologist"
          ? "🧠 Психолог кеңесі"
          : "🩺 Дәрігерді үйге шақыру",
      detectedSymptoms: ["Шағым тіркелді"],
      recommendedSpecialties: isSevereChestPain ? ["cardiologist"] : ["therapist"],
      specialistTitleKazakh: isRed
        ? "Шұғыл дәрігер"
        : careType === "nurse"
        ? "Патронаждық медбике"
        : careType === "psychologist"
        ? "Клиникалық психолог"
        : "Терапевт",
      responseMessage: isRed
        ? "🚨 НАЗАР АУДАРЫҢЫЗ! Бұл жағдайда кідірместен 103 Жедел жәрдем шақырылуы қажет!"
        : "Сұранысыңыз жүйеде тіркелді. Төмендегі батырма арқылы үйге маман шақыртуды бірден рәсімдей аласыз.",
      firstAidAdvice: isSevereChestPain ? EMERGENCY_FIRST_AID_GUIDES.HEART_ATTACK : EMERGENCY_FIRST_AID_GUIDES.DEFAULT,
      disclaimer: defaultDisclaimer,
      modelUsed: "Offline Smart Fallback"
    }
  };
}
