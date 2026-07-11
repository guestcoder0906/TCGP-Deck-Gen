import * as cheerio from 'cheerio';
const response = await fetch('https://pocket.limitlesstcg.com/cards/B3b/21');
const html = await response.text();
const $ = cheerio.load(html);
const imgs = [];
$('img').each((_, el) => imgs.push($(el).attr('src')));
console.log('Imgs:', imgs);
