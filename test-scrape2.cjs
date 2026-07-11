const https = require('https');
https.get('https://pocket.limitlesstcg.com/cards/?q=type%3Apokemon', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // regex to find pagination links
    const pagination = data.match(/<a[^>]+href="([^"]+)"[^>]*>Next/i);
    console.log(pagination ? pagination[1] : 'no next link');
  });
});
