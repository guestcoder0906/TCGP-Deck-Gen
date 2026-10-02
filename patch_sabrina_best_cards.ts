import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Update Sabrina rule in the long paragraph
content = content.replace(
  "damage-spreading attackers are paired with Sabrina,",
  "Sabrina is a situational card and should generally only be included (1 copy usually) if you have damage-spreading attackers or a control strategy that specifically benefits from forcing switches (most decks do not need her),"
);

// Update Rule 5 to emphasize searching for the best card
content = content.replace(
  "Don't just pick the first card you see; be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards.",
  "You MUST NOT just pick the first card you see. You MUST use search tools and your meta deck knowledge to find the mathematically and strategically best cards (e.g., if you need card draw, search for all draw options and pick the best one). Be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards."
);

fs.writeFileSync('server.ts', content);
