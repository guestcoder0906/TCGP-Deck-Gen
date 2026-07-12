import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Update META DECKS REFERENCE
content = content.replace(
  "9. META DECKS REFERENCE: You MUST use the 'search_meta_decks' and 'search_best_cards' tools as your VERY FIRST actions (with an empty search string) to look at the top 50 meta decks in full detail (with each card's full text and abilities included). This will give you the baseline knowledge of what cards are good (like Ice Pops vs Potion) and how top tier decks are constructed. Always search ALL variations (e.g. \"snorlax ex\" vs \"snorlax\"). Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck.",
  "9. META DECKS REFERENCE: You MUST use the 'search_meta_decks' and 'search_best_cards' tools as your VERY FIRST actions (with an empty search string) to look at the top 50 meta decks in full detail (with each card's full text and abilities included). This will give you the baseline knowledge of what cards are good (like Ice Pops vs Potion) and how top tier decks are constructed. You MUST prioritize mimicking these meta deck patterns over making up your own strategies. Always search ALL variations (e.g. \"snorlax ex\" vs \"snorlax\"). Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck."
);

// Add rule 11 for evolutions
content = content.replace(
  "10. ENERGY ZONE DECLARATION: You MUST explicitly declare 1-3 Energy Types for the Energy Zone generation in your final output. Ensure the deck is energy-efficient and correct. Anticipate energy requirements carefully: for example, do NOT run 2 different types of energies if the main Pokémon require a lot of energy and you have no energy acceleration. Usually, running one energy type (plus Colorless) makes sense unless you have a specific combo or acceleration that supports multiple types.",
  "10. ENERGY ZONE DECLARATION: You MUST explicitly declare 1-3 Energy Types for the Energy Zone generation in your final output. Ensure the deck is energy-efficient and correct. Anticipate energy requirements carefully: for example, do NOT run 2 different types of energies if the main Pokémon require a lot of energy and you have no energy acceleration. Usually, running one energy type (plus Colorless) makes sense unless you have a specific combo or acceleration that supports multiple types.\n11. EVOLUTION LINES: Do NOT forget evolutions of cards! If a basic Pokémon can evolve to become stronger (e.g., Charmeleon into Charizard), you MUST include the evolution line. Only include just the basic form if the deck explicitly relies ONLY on that basic (e.g., Snorlax stall) and it is powerful enough on its own. Including a basic Pokémon without its evolution when it is clearly meant to be evolved does not make sense and is strictly forbidden."
);

fs.writeFileSync('server.ts', content);
