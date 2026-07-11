import { GoogleGenAI, Type } from '@google/genai';

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3.1-flash-lite',
    config: {
      tools: [{
        functionDeclarations: [
          {
            name: 'notebook_write',
            description: 'Write an entry to your internal workspace notebook. Use this to track the deck idea, progress, card candidates, counter (0/20), and decisions.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                entry: { type: Type.STRING, description: 'The text to append to your notebook' }
              },
              required: ['entry']
            }
          }
        ]
      }]
    }
  });

  console.log("sending first message...");
  let currentMessage: any = "Hello";
  const response = await chat.sendMessage({ message: currentMessage });
  console.log('Function calls?', response.functionCalls);

  if (response.functionCalls) {
    const fnCalls = response.functionCalls;
    currentMessage = fnCalls.map(c => ({
      functionResponse: {
          name: c.name,
          response: { success: true },
          id: c.id
      }
    }));
    const resp2 = await chat.sendMessage({ message: currentMessage });
    console.log('Response 2:', resp2.text);
  }
}
run();
