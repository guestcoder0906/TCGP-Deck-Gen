import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const newTool = `              {
                name: 'search_meta_decks',
                description: 'Fetches the top latest meta decks from the Chase-Mew GitHub tier list. Returns full details of each deck and its cards. You can optionally provide a search term (e.g. "snorlax ex") to filter the decks by deck name or card text/name.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    search: { type: Type.STRING, description: 'Optional search term to filter decks by pokemon name (e.g., "snorlax", "charizard"). Leave empty to get the top overall meta decks.' }
                  }
                }
              },
              {
                name: 'search_best_cards',
                description: 'Fetches the overall best and most popular individual cards in the current meta based on tournament data from GitHub.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {}
                }
              },`;
              
content = content.replace(
  /\{\s*name:\s*'search_meta_decks'[\s\S]*?\}\s*\},/,
  newTool
);

const newToolImpl = `            } else if (call.name === 'search_best_cards') {
              const resScores = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/card-scores.json');
              const scores = await resScores.json();
              result = {
                top_cards: scores.slice(0, 50).map((c: any) => ({
                  name: c.name,
                  score: c.score.toFixed(3),
                  popularity: c.popularity.toFixed(3)
                }))
              };
            } else if (call.name === 'search_meta_decks') {`;

content = content.replace(
  "} else if (call.name === 'search_meta_decks') {",
  newToolImpl
);

// Update prompt to include search_best_cards
content = content.replace(
  "9. META DECKS REFERENCE: You MUST use the 'search_meta_decks' tool as your VERY FIRST action (with an empty search string) to look at the top 50 meta decks in full detail",
  "9. META DECKS REFERENCE: You MUST use the 'search_meta_decks' and 'search_best_cards' tools as your VERY FIRST actions (with an empty search string) to look at the top 50 meta decks in full detail"
);

fs.writeFileSync('server.ts', content);
