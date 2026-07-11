import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "description: 'Fetches the top latest meta decks from the Chase-Mew GitHub tier list. You can optionally provide a search term (e.g. \"snorlax\") to filter the decks.',",
  "description: 'Fetches the top latest meta decks from the Chase-Mew GitHub tier list. Returns full details of each deck and its cards. You can optionally provide a search term (e.g. \"snorlax ex\") to filter the decks by deck name or card text/name.',"
);

fs.writeFileSync('server.ts', content);
