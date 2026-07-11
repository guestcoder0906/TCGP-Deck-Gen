import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "and their full card dictionary. This will give you the baseline knowledge of what cards are good (like Ice Pops vs Potion) and how top tier decks are constructed.",
  "in full detail (with each card's full text and abilities included). This will give you the baseline knowledge of what cards are good (like Ice Pops vs Potion) and how top tier decks are constructed."
);

fs.writeFileSync('server.ts', content);
