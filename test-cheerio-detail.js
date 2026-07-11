import * as cheerio from 'cheerio';
const html = `
<div class="card-text-section">
<span class="card-text-title">Pikachu</span> - Lightning - 60 HP
<p>Electro Ball 40</p>
</div>
`;
const $ = cheerio.load(html);
console.log($('.card-text-section').text().replace(/\s+/g, ' ').trim());
