const https = require('https');
https.get('https://pocket.limitlesstcg.com/cards/?q=type%3Apokemon', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const pageIndex = data.indexOf('pagination');
    if (pageIndex > -1) {
        console.log(data.substring(pageIndex - 100, pageIndex + 300));
    } else {
        // Just print some bottom HTML
        console.log("No pagination class found. Bottom HTML:");
        console.log(data.substring(data.length - 1000));
    }
  });
});
