import * as cheerio from 'cheerio';
async function run() {
  const ids = ['b1a-024', 'a1-098', 'b1a-026'];
  const cache: any = {};
  for (const id of ids) {
    const parts = id.split('-');
    const url = `https://pocket.limitlesstcg.com/cards/${parts[0]}/${parseInt(parts[1], 10)}`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
    const text = $('.card-text-section').text().replace(/\s+/g, ' ').trim();
    cache[id] = { title, text };
  }
  console.log(cache);
}
run();
