import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const newSearchMetaDecks = `} else if (call.name === 'search_meta_decks') {
              const search = (call.args.search as string || '').toLowerCase();
              const resDecks = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/best-decks.json');
              const decks = await resDecks.json();
              
              // Pre-fetch all unique cards to build full dictionary for searching
              const uniqueCardIds = new Set<string>();
              decks.forEach((d: any) => {
                d.lists[0]?.cards.forEach((c: string) => uniqueCardIds.add(c.split(':')[1]));
              });
              
              const cardArr = [...uniqueCardIds];
              const cardDictionary: any = {};
              
              for (let i = 0; i < cardArr.length; i += 50) {
                const batch = cardArr.slice(i, i + 50);
                await Promise.all(batch.map(async (c) => {
                  if (c) {
                    const info = await fetchCardInfo(c);
                    cardDictionary[c] = info;
                  }
                }));
              }

              // Now map decks to include full card details inline
              const detailedDecks = decks.map((d: any) => {
                return {
                  name: d.name,
                  cards: (d.lists[0]?.cards || []).map((c: string) => {
                    const [count, id] = c.split(':');
                    const info = cardDictionary[id] || { title: id, text: '' };
                    return {
                      count: parseInt(count, 10),
                      id,
                      title: info.title,
                      text: info.text
                    };
                  })
                };
              });

              // Filter decks based on search term in deck name OR card details
              const filteredDecks = search ? detailedDecks.filter((d: any) => {
                if (d.name.toLowerCase().includes(search)) return true;
                return d.cards.some((c: any) => 
                  (c.title && c.title.toLowerCase().includes(search)) || 
                  (c.text && c.text.toLowerCase().includes(search))
                );
              }) : detailedDecks;

              // Top 50 of the filtered decks
              const topDecks = filteredDecks.slice(0, 50);

              result = { 
                found: filteredDecks.length, 
                decks: topDecks
              };
            } else if (call.name === 'search_cards') {`;

const startIdx = content.indexOf("} else if (call.name === 'search_meta_decks') {");
const endIdx = content.indexOf("} else if (call.name === 'search_cards') {");

content = content.substring(0, startIdx) + newSearchMetaDecks + content.substring(endIdx + "} else if (call.name === 'search_cards') {".length);

fs.writeFileSync('server.ts', content);
