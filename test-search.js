import * as cheerio from 'cheerio';
const response = await fetch('https://pocket.limitlesstcg.com/cards/?q=pikachu');
const html = await response.text();
const $ = cheerio.load(html);
const cards = [];
$('.card').each((_, el) => {
  const url = $(el).attr('href') || $(el).parent().attr('href') || $(el).find('a').attr('href');
  const img = $(el).attr('src') || $(el).find('img').attr('src');
  cards.push({ url, img });
});
console.log(cards.slice(0, 3));
