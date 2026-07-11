import * as cheerio from 'cheerio';

async function fetchCard(id: string) {
  const parts = id.split('-');
  const url = `https://pocket.limitlesstcg.com/cards/${parts[0]}/${parseInt(parts[1], 10)}`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
  const text = $('.card-text-section').text().replace(/\s+/g, ' ').trim();
  return { id, title, text };
}

async function run() {
  const res = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/best-decks.json');
  const decks = await res.json();
  const top50 = decks.slice(0, 50);
  const cards = new Set<string>();
  for (const d of top50) {
    for (const c of d.lists[0].cards) {
      cards.add(c.split(':')[1]);
    }
  }
  
  const start = Date.now();
  // Batch them to avoid connection reset
  const cardArr = [...cards];
  const results = [];
  for (let i = 0; i < cardArr.length; i += 50) {
    const batch = cardArr.slice(i, i + 50);
    const resBatch = await Promise.all(batch.map(c => fetchCard(c).catch(() => null)));
    results.push(...resBatch);
  }
  console.log(`Fetched ${results.length} cards in ${Date.now() - start}ms`);
}
run();
