import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "146-7. NO ENERGY CARDS IN DECK: Do NOT include Energy cards in your decklist! Energy cards do not exist as deck cards in Pokémon TCG Pocket. Instead, Energy is generated automatically in the Energy Zone each turn based on the types you select for your deck. The 20 cards in the deck MUST only be Pokémon and Trainer cards.",
  "7. NO ENERGY CARDS IN DECK: Do NOT include Energy cards in your decklist! Energy cards do not exist as deck cards in Pokémon TCG Pocket. Instead, Energy is generated automatically in the Energy Zone each turn based on the types you select for your deck. The 20 cards in the deck MUST only be Pokémon and Trainer cards." // just standard replace if needed
);

content = content.replace(
  "making a new deck.",
  "making a new deck.\n10. ENERGY ZONE DECLARATION: You MUST explicitly declare 1-3 Energy Types for the Energy Zone generation in your final output. Ensure the deck is energy-efficient and correct. Anticipate energy requirements carefully: for example, do NOT run 2 different types of energies if the main Pokémon require a lot of energy and you have no energy acceleration. Usually, running one energy type (plus Colorless) makes sense unless you have a specific combo or acceleration that supports multiple types."
);

fs.writeFileSync('server.ts', content);
