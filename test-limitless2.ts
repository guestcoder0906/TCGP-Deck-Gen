import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://pocket.limitlesstcg.com/cards/A1/20'; 
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const allImages = $('img').map((i, el) => $(el).attr('src')).get();
  console.log(allImages);
}
run();
