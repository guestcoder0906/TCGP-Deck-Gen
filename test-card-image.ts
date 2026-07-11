import * as cheerio from 'cheerio';
async function run() {
  const urls = [
    'https://pocket.limitlesstcg.com/cards/P-A/6',
    'https://pocket.limitlesstcg.com/cards/A1/286'
  ];
  for (const url of urls) {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    let image_url = $('meta[property="og:image"]').attr('content') || $('.card-image img').attr('src') || $('.card img').attr('src') || $('img').eq(0).attr('src') || '';
    if (image_url && image_url.startsWith("/")) {
      image_url = `https://pocket.limitlesstcg.com${image_url}`;
    }
    console.log(image_url);
  }
}
run();
