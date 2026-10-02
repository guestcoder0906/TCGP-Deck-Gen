import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "10. ENERGY ZONE DECLARATION AND POKÉMON TYPING: You MUST explicitly declare 1-3 Energy Types for the Energy Zone generation in your final output. Ensure the deck is energy-efficient and correct. The Pokémon you select MUST MATCH the Energy Types you declare. Do NOT include Pokémon that require different types of energy than what you have selected, or mix too many different types of Pokémon which makes the deck unplayable. Usually, sticking to exactly ONE main energy type for all your Pokémon (plus Colorless/Normal types) is the most efficient and makes the most sense. Anticipate energy requirements carefully: do NOT run 2 different types of energies if the main Pokémon require a lot of energy and you have no energy acceleration.",
  "10. ENERGY ZONE DECLARATION AND POKÉMON TYPING: You MUST explicitly declare 1-3 Energy Types for the Energy Zone generation in your final output. Ensure the deck is energy-efficient and correct. The Pokémon you select MUST MATCH the Energy Types you declare. Do NOT include Pokémon that require different types of energy than what you have selected, or mix too many different types of Pokémon which makes the deck unplayable. Usually, sticking to exactly ONE main energy type for all your Pokémon (plus Colorless/Normal types) is the most efficient and makes the most sense. Anticipate energy requirements carefully: do NOT run 2 different types of energies if the main Pokémon require a lot of energy and you have no energy acceleration (unless it is a Dragon-type or another specific case that genuinely requires and works well with 2+ energy types)."
);

fs.writeFileSync('server.ts', content);
