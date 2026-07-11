import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Update prompt
content = content.replace(
  "Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck.",
  "Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck. ALWAYS call 'search_meta_decks' as your VERY FIRST action (with an empty search string) to look at the top 50 meta decks and their full card dictionary. This will give you the baseline knowledge of what cards are good (like Ice Pops vs Potion) and how top tier decks are constructed."
);

// Add fetchCardInfo function and cache
const fetchCardCode = `
const cardCache = new Map<string, {title: string, text: string}>();
async function fetchCardInfo(id: string) {
  if (cardCache.has(id)) return cardCache.get(id);
  try {
    const parts = id.split('-');
    const url = \`https://pocket.limitlesstcg.com/cards/\${parts[0]}/\${parseInt(parts[1], 10)}\`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
    const text = $('.card-text-section').text().replace(/\\s+/g, ' ').trim();
    const data = { title, text };
    cardCache.set(id, data);
    return data;
  } catch (e) {
    return { title: id, text: 'Failed to load card' };
  }
}
`;

content = content.replace(
  "const app = express();",
  fetchCardCode + "\nconst app = express();"
);

// Replace search_meta_decks implementation
const newSearchMetaDecks = `} else if (call.name === 'search_meta_decks') {
              const search = (call.args.search as string) || '';
              const resDecks = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/best-decks.json');
              const decks = await resDecks.json();
              const filtered = search 
                ? decks.filter((d: any) => d.name.toLowerCase().includes(search.toLowerCase()))
                : decks;
                
              const topDecks = filtered.slice(0, 50);
              
              const uniqueCardIds = new Set<string>();
              topDecks.forEach((d: any) => {
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

              result = { 
                found: filtered.length, 
                decks: topDecks.map((d: any) => ({ 
                  name: d.name, 
                  cards: d.lists[0]?.cards 
                })),
                card_dictionary: cardDictionary
              };
            } else if (call.name === 'search_cards') {`;

content = content.replace(
  "} else if (call.name === 'search_meta_decks') {",
  "// SEARCH_META_DECKS_MARKER\n            } else if (call.name === 'search_meta_decks') {"
);

// Remove the old implementation
const startIdx = content.indexOf("// SEARCH_META_DECKS_MARKER");
const endIdx = content.indexOf("} else if (call.name === 'search_cards') {");
content = content.substring(0, startIdx) + newSearchMetaDecks + content.substring(endIdx + "} else if (call.name === 'search_cards') {".length);

fs.writeFileSync('server.ts', content);
