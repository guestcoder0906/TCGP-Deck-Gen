import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "3. In your final response, you MUST output the full decklist as text, but you MUST ALSO output the individual images of every single card in the deck. If a card has 2 copies, you MUST output its image TWICE (e.g. \\`![Name](url) ![Name](url)\\`). You MUST strictly use Markdown image syntax \\`![Name](url)\\` and NOT HTML tags. The total number of images shown must be exactly 20.",
  "3. In your final response, you MUST output the full decklist as text, but you MUST ALSO output the individual images of every single card in the deck. If a card has 2 copies, you MUST output its image TWICE (e.g. \\`![CardName](url) ![CardName](url)\\`). You MUST strictly use Markdown image syntax \\`![actual card name](url)\\` and NOT HTML tags. Do NOT literally write 'Name', replace it with the actual card name. The total number of images shown must be exactly 20."
);

content = content.replace(
  "You MUST use your meta deck knowledge to find the mathematically and strategically best Trainer cards (e.g., if you need healing, prioritize cards like 'Lucky Ice Pop' which has higher potential than a basic 'Potion'). Make the absolute most of the strict 20-card space and do NOT settle for suboptimal cards. Be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards.",
  "You MUST use your meta deck knowledge to find the mathematically and strategically best Trainer cards (e.g., if you need healing, prioritize cards like 'Lucky Ice Pop' which has higher potential than a basic 'Potion'). ALWAYS look for meta deck patterns and anticipate synergies with specific items (e.g., if you are building a Fire deck, you should likely include Fire Patch since it's a staple in meta fire decks for energy acceleration). Make the absolute most of the strict 20-card space and do NOT settle for suboptimal cards. Be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards."
);

fs.writeFileSync('server.ts', content);
