async function run() {
  const url1 = 'https://pocket.limitlesstcg.com/cards/?q=type%3Apokemon&pg=2';
  const url2 = 'https://pocket.limitlesstcg.com/cards/?q=type%3Apokemon&page=2';
  
  const res1 = await fetch(url1);
  const text1 = await res1.text();
  console.log('pg=2 pagination text:', text1.match(/<ul class="pagination"[^>]*>([\s\S]*?)<\/ul>/)?.[0].substring(0, 200));

  const res2 = await fetch(url2);
  const text2 = await res2.text();
  console.log('page=2 pagination text:', text2.match(/<ul class="pagination"[^>]*>([\s\S]*?)<\/ul>/)?.[0].substring(0, 200));
}
run();
