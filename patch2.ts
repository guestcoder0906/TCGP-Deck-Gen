import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Add the tool declaration
content = content.replace(
  "              {\n                name: 'view_card',",
  `              {
                name: 'search_meta_decks',
                description: 'Fetches the top latest meta decks from the Chase-Mew GitHub tier list. You can optionally provide a search term (e.g. "snorlax") to filter the decks.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    search: { type: Type.STRING, description: 'Optional search term to filter decks by pokemon name (e.g., "snorlax", "charizard"). Leave empty to get the top overall meta decks.' }
                  }
                }
              },
              {
                name: 'view_card',`
);

// add to tool execution
content = content.replace(
  "} else if (call.name === 'search_cards') {",
  `} else if (call.name === 'search_meta_decks') {
              const search = (call.args.search as string) || '';
              const resDecks = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/best-decks.json');
              const decks = await resDecks.json();
              const filtered = search 
                ? decks.filter((d: any) => d.name.toLowerCase().includes(search.toLowerCase()))
                : decks;
              result = { 
                found: filtered.length, 
                decks: filtered.slice(0, 5).map((d: any) => ({ 
                  name: d.name, 
                  cards: d.lists[0]?.cards 
                })) 
              };
            } else if (call.name === 'search_cards') {`
);

// fix image_url to prefer .card-image img
content = content.replace(
  "let image_url = $('meta[property=\"og:image\"]').attr('content') || $('.card-image img').attr('src') || $('.card img').attr('src') || $('img').eq(0).attr('src') || '';",
  "let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property=\"og:image\"]').attr('content') || $('img').eq(0).attr('src') || '';"
);

fs.writeFileSync('server.ts', content);
