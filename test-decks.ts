async function run() {
  const res = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/best-decks.json');
  const decks = await res.json();
  const search = 'snorlax';
  const filtered = search 
    ? decks.filter((d: any) => d.name.toLowerCase().includes(search.toLowerCase()))
    : decks;
  console.log(filtered.slice(0, 2).map((d: any) => ({ name: d.name, top_list: d.lists[0] })));
}
run();
