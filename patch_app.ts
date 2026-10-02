import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const newApp = `export default function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-rose-500/30">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <Sparkles className="w-6 h-6" />
            <span className="font-semibold text-lg tracking-tight text-white">TCG Pocket Deck Builder</span>
          </div>

          <a 
            href="https://pocket.limitlesstcg.com/cards/" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            Go to Limitless <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AIDeckBuilder />
      </main>
    </div>
  );
}`;

content = content.replace(/export default function App\(\) \{[\s\S]*?\}\n\nfunction LensCapturer/, newApp + '\n\nfunction LensCapturer');

// Remove LensCapturer completely
content = content.replace(/function LensCapturer\(\) \{[\s\S]*?\}\n\nfunction AIDeckBuilder/, "function AIDeckBuilder");

fs.writeFileSync('src/App.tsx', content);
