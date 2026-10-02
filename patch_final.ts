import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Update image extraction in fetchCardInfo
content = content.replace(
  "    if (image_url && image_url.startsWith(\"/\")) {\n      image_url = `https://pocket.limitlesstcg.com${image_url}`;\n    }",
  "    if (image_url && !image_url.startsWith(\"http\")) {\n      image_url = new URL(image_url, url).href;\n    }"
);

// Update image extraction in view_card
content = content.replace(
  "              if (image_url && image_url.startsWith(\"/\")) {\n                image_url = `https://pocket.limitlesstcg.com${image_url}`;\n              }",
  "              if (image_url && !image_url.startsWith(\"http\")) {\n                image_url = new URL(image_url, url).href;\n              }"
);

// Update Synergy rule
content = content.replace(
  "5. SYNERGY & SMART SELECTION: You MUST carefully read what each card does (abilities, attacks, costs) and think deeply about how to create strong synergies with other Pokemon, Trainers, or energy acceleration methods. Don't just pick the first card you see; be smart, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly.",
  "5. SYNERGY, ANTI-SYNERGY & SMART SELECTION: You MUST carefully read what each card does (abilities, attacks, costs) and track everything carefully to create strong synergies. You MUST avoid anti-synergies or redundant effects (e.g., do not include an X Speed if your main Pokémon's retreat cost is already reduced to 0 by another card like Bombardier, do not include cards that affect types you aren't using). Don't just pick the first card you see; be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards."
);

fs.writeFileSync('server.ts', content);
