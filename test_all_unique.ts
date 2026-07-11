async function run() {
  const res = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/best-decks.json');
  const decks = await res.json();
  const cards = new Set<string>();
  for (const d of decks) {
    for (const c of d.lists[0].cards) {
      cards.add(c.split(':')[1]);
    }
  }
  console.log('Total decks:', decks.length);
  console.log('Unique cards in all decks:', cards.size);
}
run();
