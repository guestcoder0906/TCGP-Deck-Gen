import * as cheerio from 'cheerio';
async function run() {
  const id = 'b1a-024';
  const parts = id.split('-');
  const set = parts[0];
  const num = parseInt(parts[1], 10);
  const url = `https://pocket.limitlesstcg.com/cards/${set}/${num}`;
  console.log(url);
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
  const text = $('.card-text-section').text().replace(/\s+/g, ' ').trim();
  console.log({ title, text });
}
run();
