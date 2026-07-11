import * as cheerio from 'cheerio';
async function run() {
  const res = await fetch(`https://pocket.limitlesstcg.com/cards/?q=Charizard&display=list`);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log($('a.card').length); // wait, maybe different selector
  console.log($('.card-text').length);
}
run();
