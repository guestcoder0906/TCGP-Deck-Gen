import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  "If a card has 2 copies, you MUST output its image TWICE (e.g. \\`![Name](url) ![Name](url)\\`). The total number of images shown must be exactly 20.",
  "If a card has 2 copies, you MUST output its image TWICE (e.g. \\`![Name](url) ![Name](url)\\`). You MUST strictly use Markdown image syntax `![Name](url)` and NOT HTML tags. The total number of images shown must be exactly 20."
);

fs.writeFileSync('server.ts', content);
