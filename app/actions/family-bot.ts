"use server";

import { MOCK_FAMILY_PATIENTS } from "@/lib/family-data";

const ALEM_LLM_URL = process.env.ALEM_LLM_URL || "https://llm.alem.ai/v1/chat/completions";
const GEMMA4_API_KEY = process.env.GEMMA4_API_KEY || "sk-fRTCBpsPEHKVIsK2pvbnxA";
const ALEMLLM_API_KEY = process.env.ALEMLLM_API_KEY || "sk-I8agzhli09Od5WbFynXkyA";

export interface FamilyBotResponse {
  answer: string;
  referencedPatient?: string;
  actionRecommendation?: {
    type: "call_103" | "call_doctor" | "call_nurse" | "call_psychologist" | "take_medication";
    title: string;
    details?: string;
  };
}

export async function askFamilyMedBot(
  userQuery: string,
  chatHistory: { role: "user" | "assistant"; text: string }[] = []
): Promise<{ success: boolean; data: FamilyBotResponse }> {
  const familyContextString = JSON.stringify(MOCK_FAMILY_PATIENTS, null, 2);

  const systemPrompt = `
Сіз — MedTech HomeCare жүйесінің әмбебап әрі ақылды Отбасылық Медициналық ЖИ Чат-ботысыз.

СІЗДІҢ МҮМКІНДІКТЕРІҢІЗ:
1. КЕЗ КЕЛГЕН СҰРАҚҚА ЖАУАП БЕРУ:
   - Денсаулық, медицина, алғашқы көмек, дәрі-дәрмектердің әсері, симптомдар, диета, психологиялық қолдау немесе күнделікті күтім туралы кез келген сұраққа қазақша (немесе сұрақ қойылған тілде) толық, жылы, кәсіби әрі түсінікті жауап бересіз.
   - Егер сұрақ медицинадан тыс жалпы тақырыпта болса да, жылы шыраймен бағыт-бағдар беріп, көмектесесіз.

2. ОТБАСЫ МҮШЕЛЕРІНІҢ НАҚТЫ БАЗАСЫ (Егер сұрақ үйдегі нақты адамдарға қатысты болса):
   - Сізде үйдегі нақты науқастардың деректері бар:
${familyContextString}
   - Егер қолданушы "Атам...", "Айсұлу апай...", "Батырхан...", "дәрілері қандай?", "соңғы қысымы қанша?" деп сұраса — осы базадағы нақты мәліметтерді пайдаланып жауап бересіз.

3. ҚАУІПСІЗДІК ЕРЕЖЕЛЕРІ:
   - Өмірге шұғыл қауіп төнгенде (инфаркт, инсульт белгілері, қатты қан кету, естен тану) — дереу 103 Жедел жәрдем шақыруды ескертіңіз.
   - Үйде дәрігер қарауы немесе медбике көмегі керек болса — жүйеден тиісті маманды шақыруды ұсыныңыз.

Жауаптарыңыз жанашыр, қазақы мәдениетке сай, қамқор және сауатты болсын.
`;

  try {
    // Call Gemma 4 or AlemLLM
    const res = await fetch(ALEM_LLM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMMA4_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemma4",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory.slice(-4).map(m => ({ role: m.role, content: m.text })),
          { role: "user", content: userQuery }
        ],
        temperature: 0.4
      }),
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Alem.ai API error");
    const json = await res.json();
    const answer = json.choices?.[0]?.message?.content?.trim() || "";

    return {
      success: true,
      data: {
        answer
      }
    };
  } catch (err) {
    console.warn("Alem.ai API failed, trying AlemLLM:", err);
    try {
      const res = await fetch(ALEM_LLM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ALEMLLM_API_KEY}`
        },
        body: JSON.stringify({
          model: "alemllm",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery }
          ]
        }),
        cache: "no-store"
      });
      const json = await res.json();
      const answer = json.choices?.[0]?.message?.content?.trim() || "";
      return { success: true, data: { answer } };
    } catch (fallbackErr) {
      // Rule-based fallback using local family data
      const q = userQuery.toLowerCase();
      let answer = "Сіздің сұрағыңыз қабылданды. ";

      if (q.includes("ата") || q.includes("қайрат") || q.includes("қысым") || q.includes("жүрек")) {
        const kairat = MOCK_FAMILY_PATIENTS[0];
        answer = `Қайрат ақсақалдың жағдайы: диагнозы — ${kairat.diagnosis}. 
Соңғы қысымы: ${kairat.lastVitals.bloodPressure} (${kairat.lastVitals.recordedAt}). 
Тағайындалған дәрілері: 
• Лизиноприл (10 мг) — таңертең сағат 09:00-де; 
• Бисопролол (5 мг) — таңертең сағат 09:00-де; 
• Кардиомагнил (75 мг) — кешкі 20:00-де. 
Дәрігері: ${kairat.lastDoctorVisit.doctorName}. Тұзды шектеп, күніне 2 рет қысым өлшеу қажет.`;
      } else if (q.includes("ана") || q.includes("айсұлу") || q.includes("диабет") || q.includes("жара") || q.includes("қант")) {
        const aisulu = MOCK_FAMILY_PATIENTS[1];
        answer = `Айсұлу апайдың жағдайы: диагнозы — ${aisulu.diagnosis}. 
Соңғы қант деңгейі: ${aisulu.lastVitals.glucose} (${aisulu.lastVitals.recordedAt}). 
Дәрілері: Метформин 850 мг (күніне 2 рет), Инсулин 14 ЕД (кешкі 21:00-де). 
Бүгін сағат 11:30-да медбике Меруерт Саматқызы келіп, отадан кейінгі жараны таңу (перевязка) жүргізеді.`;
      } else if (q.includes("бала") || q.includes("батырхан") || q.includes("жөтел") || q.includes("қызу")) {
        const batyr = MOCK_FAMILY_PATIENTS[2];
        answer = `Батырханның жағдайы: диагнозы — ${batyr.diagnosis}. 
Емі: Амброксол шәрбаты (5 мл, күніне 3 рет) және Фенистил тамшылары (түнде 15 тамшы). 
Дәрігер кеңесі: бөлмені желдетіп, жылы сұйықтық көп ішкізу керек. Ертең сағат 16:00-де педиатр Др. Омарова Зере тексереді.`;
      } else {
        answer = `Сәлеметсіз бе! Мен сіздің отбасыңыздың үйдегі науқастары (Қайрат ақсақал, Айсұлу апай, Батырхан) бойынша барлық дәрі-дәрмек кестесін, дәрігер жазбаларын және жоспарланған емдік шараларды білемін. Қай науқас туралы немесе қандай дәрі туралы сұрағыңыз бар?`;
      }

      return {
        success: true,
        data: { answer }
      };
    }
  }
}
