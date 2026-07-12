import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const newFetchCardInfo = `async function fetchCardInfo(id: string) {
  if (cardCache.has(id)) return cardCache.get(id);
  try {
    const parts = id.split('-');
    const url = \`https://pocket.limitlesstcg.com/cards/\${parts[0]}/\${parseInt(parts[1], 10)}\`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
    const text = $('.card-text-section').text().replace(/\\s+/g, ' ').trim();
    let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property="og:image"]').attr('content') || $('img').eq(0).attr('src') || '';
    if (image_url && image_url.startsWith("/")) {
      image_url = \`https://pocket.limitlesstcg.com\${image_url}\`;
    }
    const data = { title, text, image_url };
    cardCache.set(id, data);
    return data;
  } catch (e) {
    return { title: id, text: 'Failed to load card', image_url: '' };
  }
}`;

content = content.replace(
  /async function fetchCardInfo[\s\S]*?\}\s*\}/,
  newFetchCardInfo
);

content = content.replace(
  "id,\n                      title: info.title,\n                      text: info.text\n                    };",
  "id,\n                      title: info.title,\n                      text: info.text,\n                      image_url: info.image_url\n                    };"
);

fs.writeFileSync('server.ts', content);
