const fetch = require('node-fetch'); // we can just use native fetch if node 18+
async function run() {
  const q = 'type:pokemon';
  const url = `http://localhost:3000/api/scrape?q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('Scrape result:', data);

  const captureUrl = `http://localhost:3000/api/capture-page?q=${encodeURIComponent(q)}&pg=2`;
  console.log('Fetching capture URL:', captureUrl);
  const captureRes = await fetch(captureUrl);
  const captureData = await captureRes.json();
  console.log('Capture result:', captureData);
}
run();
