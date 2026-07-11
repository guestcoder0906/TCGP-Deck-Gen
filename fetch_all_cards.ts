import * as cheerio from 'cheerio';
async function run() {
  const res = await fetch('https://pocket.limitlesstcg.com/cards/');
  const html = await res.text();
  const $ = cheerio.load(html);
  // find all card links? No, the search page without query shows what?
}
run();
