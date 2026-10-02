import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const scrapeStart = content.indexOf("app.get('/api/scrape'");
if (scrapeStart !== -1) {
  const scrapeEndStr = "app.post('/api/chat', async (req, res) => {";
  const scrapeEnd = content.indexOf(scrapeEndStr);
  
  if (scrapeEnd !== -1) {
    // Remove the whole block, and also the puppeteer browser initialization part before it
    const startIdx = content.indexOf("let browser: puppeteer.Browser | null = null;");
    if (startIdx !== -1) {
      content = content.substring(0, startIdx) + content.substring(scrapeEnd);
    }
  }
}

// Remove puppeteer import
content = content.replace("import puppeteer from 'puppeteer';", "");

fs.writeFileSync('server.ts', content);
