import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://pocket.limitlesstcg.com/cards/P-A/6'; 
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
  const text = $('.card-text-section').text().replace(/\s+/g, ' ').trim();
  const image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('img').eq(0).attr('src') || '';
  const og_image = $('meta[property="og:image"]').attr('content') || '';
  
  const main_image = $('.card-image img').attr('src');
  const print_image = $('.print-image img').attr('src');
  console.log({ title, main_image, print_image, og_image });
}
run();
