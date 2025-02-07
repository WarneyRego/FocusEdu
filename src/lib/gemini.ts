import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateStudyPlan(subjects: string[], hoursPerDay: number) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const totalMinutes = hoursPerDay * 60; // Convertendo horas para minutos
    const minutesPerSubject = Math.floor(totalMinutes / subjects.length); 
    const prompt = `Você é uma IA especializada em criar planos de estudo personalizados. Retorne APENAS um JSON válido no seguinte formato:
    {
      "schedule": [
        { "subject": "Nome da materia, "duration": "Duração em minutos (respeitando o tempo total de ${totalMinutes} minutos por dia, distribuído igualmente ou de forma otimizada), "focus": "O que focar e um Resumo breve do assunto abordado" }
      ]
    }
    
      
    Agora, crie um plano de estudo detalhado para as seguintes matérias: ${subjects.join(', ')} considerando que o usuário tem ${hoursPerDay} horas disponíveis por dia. 
    - Divida o tempo de forma eficiente entre as matérias.
    - Sempre Incluir resumos relevantes para cada matéria no focus. 
    - NÃO adicione explicações extras, apenas retorne o JSON puro no formato solicitado`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Obtém a resposta como texto

    // Tenta encontrar um JSON válido na resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON response from Gemini API");

    const cleanJson = jsonMatch[0]
      .replace(/```json/g, "") // Remove possíveis blocos de código Markdown
      .replace(/```/g, ""); // Remove ``` caso o Gemini retorne isso

    return JSON.parse(cleanJson); // Faz o parse do JSON limpo
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
}
