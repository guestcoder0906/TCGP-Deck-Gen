import { GoogleGenAI, Type } from '@google/genai';

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3.1-flash-lite',
    config: {
      tools: [{
        functionDeclarations: [
          {
            name: 'get_weather',
            description: 'Get weather',
            parameters: {
              type: Type.OBJECT,
              properties: {
                loc: { type: Type.STRING }
              },
              required: ['loc']
            }
          }
        ]
      }]
    }
  });

  const response = await chat.sendMessage({ message: 'What is the weather in SF?' });
  console.log('Function call?', response.functionCalls);

  if (response.functionCalls) {
    const fnCalls = response.functionCalls;
    try {
      const resp2 = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name: fnCalls[0].name,
              response: { weather: 'sunny' }
            }
          }
        ] as any
      });
      console.log('Response 2:', resp2.text);
    } catch(e: any) {
      console.error('Error with message array:', e.message);
      
      try {
        const resp3 = await chat.sendMessage({
          message: fnCalls.map(c => ({
             functionResponse: {
                 name: c.name,
                 response: { weather: 'sunny' }
             }
          })) as any
        });
        console.log('Response 3:', resp3.text);
      } catch(e2: any) {
        console.error('Error 3:', e2.message);
      }
    }
  }
}
run();
