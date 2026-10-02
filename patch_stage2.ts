import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "11. EVOLUTION LINES: Do NOT forget evolutions of cards! If a basic Pokémon can evolve to become stronger (e.g., Charmeleon into Charizard), you MUST include the evolution line. Only include just the basic form if the deck explicitly relies ONLY on that basic (e.g., Snorlax stall) and it is powerful enough on its own. Including a basic Pokémon without its evolution when it is clearly meant to be evolved does not make sense and is strictly forbidden.",
  "11. EVOLUTION LINES & RARE CANDY: Do NOT forget evolutions of cards! If a basic Pokémon can evolve to become stronger (e.g., Charmeleon into Charizard), you MUST include the evolution line. If you are using a Stage 2 Pokémon, you MUST strongly consider using Rare Candy to speed up evolution. A recommended, space-efficient meta ratio for a Stage 2 line is 2 Basics, 1 Stage 1, 2 Stage 2s, and 2 Rare Candies. Only include just the basic form if the deck explicitly relies ONLY on that basic (e.g., Snorlax stall) and it is powerful enough on its own. Including a basic Pokémon without its evolution when it is clearly meant to be evolved does not make sense and is strictly forbidden."
);

fs.writeFileSync('server.ts', content);
