const https = require('https');
https.get('https://pocket.limitlesstcg.com/cards/?q=pikachu', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 1000));
    // regex to find image tags
    const imgs = data.match(/<img[^>]+src="([^">]+)"/g);
    console.log(imgs ? imgs.slice(0, 5) : 'no imgs');
  });
});
