import { GoogleGenAI, Type } from '@google/genai';

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      tools: [{
        functionDeclarations: [
          {
            name: 'notebook_write',
            description: 'Write an entry to your internal workspace notebook to log progress, deck stats, selected cards, and thoughts.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                entry: { type: Type.STRING, description: 'The text to write into the notebook' }
              },
              required: ['entry']
            }
          }
        ]
      }]
    }
  });

  const response = await chat.sendMessage({ message: 'Initialize your notebook and write "Hello world".' });
  console.log('Function call?', response.functionCalls);
}
run();
