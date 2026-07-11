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
  console.log('Unique cards:', cards.size);
}
run();
