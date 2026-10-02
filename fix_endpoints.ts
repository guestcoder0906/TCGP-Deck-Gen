import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const getBrowserStart = content.indexOf("let browser: any = null;");
const buildDeckStart = content.indexOf("app.get('/api/agent/build-deck', async (req, res) => {");

if (getBrowserStart !== -1 && buildDeckStart !== -1) {
  content = content.substring(0, getBrowserStart) + content.substring(buildDeckStart);
}

fs.writeFileSync('server.ts', content);
