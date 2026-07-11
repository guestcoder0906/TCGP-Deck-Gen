import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://pocket.limitlesstcg.com/cards/A1/286'; 
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
  const text = $('.card-text-section').text().replace(/\s+/g, ' ').trim();
  const og_image = $('meta[property="og:image"]').attr('content');
  const card_image = $('.card-image img').attr('src');
  const card_img = $('.card img').attr('src');
  const first_img = $('img').eq(0).attr('src');
  
  console.log({ title, og_image, card_image, card_img, first_img });
}
run();
