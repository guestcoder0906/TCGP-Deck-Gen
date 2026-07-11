import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://pocket.limitlesstcg.com/cards/A1/20'; 
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log($('.card-image').html());
}
run();
