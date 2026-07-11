import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Add to CRITICAL
content = content.replace(
  "8. USE EXACT IMAGE URLS: You MUST use the exact `image_url` returned by the 'view_card' tool for every single card in your final Markdown response. Do NOT hallucinate image URLs or guess them.",
  "8. USE EXACT IMAGE URLS: You MUST use the exact `image_url` returned by the 'view_card' tool for every single card in your final Markdown response. Do NOT hallucinate image URLs or guess them.\n9. META DECKS REFERENCE: You MUST use the 'search_meta_decks' tool as your primary reference for the top latest meta decks. You are encouraged to query it ANY time while building a deck. Always check if the user's requested strategy or Pokémon exists in the meta decks (e.g. search \"snorlax\" in meta decks). If not found, look up general top meta decks for inspiration. Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck."
);

// Add the tool declaration
content = content.replace(
  "{ name: 'view_card',",
  `{
                name: 'search_meta_decks',
                description: 'Fetches the top latest meta decks from the Chase-Mew GitHub tier list. You can optionally provide a search term (e.g. "snorlax") to filter the decks.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    search: { type: Type.STRING, description: 'Optional search term to filter decks by pokemon name (e.g., "snorlax", "charizard"). Leave empty to get the top overall meta decks.' }
                  }
                }
              },
              { name: 'view_card',`
);

fs.writeFileSync('server.ts', content);
