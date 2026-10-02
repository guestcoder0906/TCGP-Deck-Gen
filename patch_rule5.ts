import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "You MUST NOT just pick the first card you see. You MUST use search tools and your meta deck knowledge to find the mathematically and strategically best cards (e.g., if you need card draw, search for all draw options and pick the best one). Be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards.",
  "You MUST NOT just pick the first card you see. You MUST use search tools to evaluate ALL versions of a specific Pokémon (e.g. search for all 'Charmeleon' cards and compare them, picking the optimal one with the best ability/stats for your deck, like the one that gives fire energy upon evolving, rather than just the first one you find). You MUST use your meta deck knowledge to find the mathematically and strategically best Trainer cards (e.g., if you need healing, prioritize cards like 'Lucky Ice Pop' which has higher potential than a basic 'Potion'). Make the absolute most of the strict 20-card space and do NOT settle for suboptimal cards. Be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards."
);

fs.writeFileSync('server.ts', content);
