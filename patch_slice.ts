import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "const topDecks = filteredDecks.slice(0, 50);",
  "const topDecks = filteredDecks;" // Just return all
);

content = content.replace(
  "look at the top 50 meta decks in full detail",
  "look at ALL meta decks in full detail"
);

fs.writeFileSync('server.ts', content);
