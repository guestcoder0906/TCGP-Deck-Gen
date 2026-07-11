import * as cheerio from 'cheerio';
const response = await fetch('https://pocket.limitlesstcg.com/cards/B3b/21');
const html = await response.text();
const $ = cheerio.load(html);
console.log('Title:', $('title').text());
console.log('Text:', $('.card-text-section').text().replace(/\s+/g, ' '));
