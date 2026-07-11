import * as cheerio from 'cheerio';
async function run() {
  const res = await fetch(`https://pocket.limitlesstcg.com/cards/?q=Charizard`);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const firstCard = $('.card').first();
  console.log(firstCard.html());
  console.log(firstCard.parent().html());
}
run();
