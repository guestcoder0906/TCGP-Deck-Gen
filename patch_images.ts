import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Fix in fetchCardInfo
content = content.replace(
  "let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property=\"og:image\"]').attr('content') || $('img').eq(0).attr('src') || '';",
  "let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property=\"og:image\"]').attr('content') || '';\n    if (image_url.includes('limitless.png')) image_url = '';"
);

// Fix in view_card
content = content.replace(
  "let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property=\"og:image\"]').attr('content') || $('img').eq(0).attr('src') || '';",
  "let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property=\"og:image\"]').attr('content') || '';\n              if (image_url.includes('limitless.png')) image_url = '';"
);

// Update prompt to add search terms constraint
content = content.replace(
  "Always search ALL variations (e.g. \"snorlax ex\" vs \"snorlax\"). Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck.",
  "Always make search term(s) for ALL meta decks and not just top 50, and search variations of that search term if nothing comes up. Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck."
);

fs.writeFileSync('server.ts', content);
