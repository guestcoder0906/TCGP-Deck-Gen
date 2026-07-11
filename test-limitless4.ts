import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://pocket.limitlesstcg.com/cards/A1/286'; // Charizard ex? Let's see
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log($('.card-image').html());
  console.log($('meta[property="og:image"]').attr('content'));
}
run();
