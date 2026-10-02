import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Fix the backticks issue in the prompt
content = content.replace(
  "You MUST strictly use Markdown image syntax `![Name](url)` and NOT HTML tags.",
  "You MUST strictly use Markdown image syntax \\`![Name](url)\\` and NOT HTML tags."
);

// Remove the unused getBrowser code and app.get('/api/scrape') entirely
const getBrowserStart = content.indexOf("let browser: any = null;");
if (getBrowserStart !== -1) {
  const scrapeEndStr = "app.post('/api/chat', async (req, res) => {";
  const scrapeEnd = content.indexOf(scrapeEndStr);
  
  if (scrapeEnd !== -1) {
    content = content.substring(0, getBrowserStart) + content.substring(scrapeEnd);
  }
}

fs.writeFileSync('server.ts', content);
