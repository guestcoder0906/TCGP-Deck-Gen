import * as cheerio from 'cheerio';
async function run() {
  const res = await fetch(`https://pocket.limitlesstcg.com/cards/?q=Charizard`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const cards: {name: string, url: string}[] = [];
  $('.card').each((_, el) => {
    const url = $(el).attr('href') || $(el).parent().attr('href') || $(el).find('a').attr('href');
    let name = $(el).attr('title') || $(el).attr('alt') || 'Unknown Card';
    if (!name || name === 'Unknown Card') {
      name = $(el).find('img').attr('alt') || $(el).find('img').attr('title') || 'Unknown Card';
    }
    if (url) cards.push({ name, url: `https://pocket.limitlesstcg.com${url}` });
  });
  console.log(cards);
}
run();
