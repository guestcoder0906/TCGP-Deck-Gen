import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://pocket.limitlesstcg.com/cards/a1/1';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log('og:image:', $('meta[property="og:image"]').attr('content'));
  console.log('.card-image img:', $('.card-image img').attr('src'));
  console.log('.card img:', $('.card img').attr('src'));
}
run();
