import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Image as ImageIcon, ExternalLink, ChevronRight, Play, BookOpen, Sparkles, Terminal, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lens' | 'builder'>('builder');

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-rose-500/30">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <ImageIcon className="w-6 h-6" />
            <span className="font-semibold text-lg tracking-tight text-white">Limitless Tools</span>
          </div>
          
          <div className="flex bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'builder' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-4 h-4" /> AI Deck Builder
            </button>
            <button
              onClick={() => setActiveTab('lens')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'lens' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Lens Capturer
            </button>
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
        {activeTab === 'lens' ? <LensCapturer /> : <AIDeckBuilder />}
      </main>
    </div>
  );
}

function LensCapturer() {
  const [query, setQuery] = useState('name:"pikachu ex"');
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [images, setImages] = useState<{ url: string; page: number }[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  
  const examples = [
    'name:"pikachu ex"',
    'text:"draw card"',
    'type:trainer',
    'is:mega',
    'type:dragon stage:basic',
    'hp>100',
    'retreat<=1',
    'has:ability retreat<=1',
    '!set:B3b retreat<=1',
    'rarity:3 retreat<=1'
  ];

  const captureImages = async (searchQuery: string) => {
    setLoading(true);
    setCapturing(true);
    setError(null);
    setImages([]);
    setProgress({ current: 0, total: 0 });
    
    let q = searchQuery;
    if (q.includes('?q=')) {
      try {
        const url = new URL(q);
        q = url.searchParams.get('q') || '';
      } catch (e) {}
    }

    try {
      const scrapeRes = await fetch(`/api/scrape?q=${encodeURIComponent(q)}`);
      if (!scrapeRes.ok) throw new Error('Failed to fetch from server');
      const scrapeData = await scrapeRes.json();
      
      if (scrapeData.error) throw new Error(scrapeData.error);

      const maxPage = scrapeData.maxPage || 1;
      setProgress({ current: 0, total: maxPage });

      let allImages: { url: string; page: number }[] = [];

      for (let p = 1; p <= maxPage; p++) {
        const captureRes = await fetch(`/api/capture-page?q=${encodeURIComponent(q)}&pg=${p}`);
        if (!captureRes.ok) throw new Error(`Failed to capture page ${p}`);
        const captureData = await captureRes.json();
        
        allImages = [...allImages, { url: captureData.url, page: p }];
        setImages([...allImages]);
        setProgress({ current: p, total: maxPage });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while capturing images.');
    } finally {
      setLoading(false);
      setCapturing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      captureImages(query.trim());
    }
  };

  return (
    <div>
      {/* Search Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Capture every card.
          </h1>
          <p className="text-neutral-400 text-lg">
            Enter a search query or limitless URL to automatically scrape all card images across all paginated results.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative flex items-center mb-6">
          <div className="absolute left-4 text-neutral-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g., name:"pikachu ex" or type:dragon stage:basic'
            className="w-full bg-neutral-800 border border-neutral-700 rounded-full py-4 pl-12 pr-32 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-lg"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 bg-rose-600 hover:bg-rose-500 text-white px-6 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Capture
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider mr-2">Try:</span>
          {examples.slice(0, 5).map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="text-xs px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-950/50 border border-red-900 rounded-xl text-red-200 text-sm mb-8 text-center">
          {error}
        </div>
      )}

      {capturing && (
        <div className="max-w-2xl mx-auto p-6 bg-neutral-800/50 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center mb-12">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Capturing Cards</h3>
          {progress.total > 0 ? (
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-neutral-400 mb-2">
                <span>Page {progress.current} of {progress.total}</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">Initializing search...</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                Results
                <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded-md">
                  {images.length} Pages
                </span>
              </h2>
              {!capturing && (
                <span className="text-sm text-emerald-400 font-medium">Capture Complete</span>
              )}
            </div>
            
            <div className="flex flex-col gap-12">
              {images.map((img, i) => (
                <motion.div
                  key={`${img.url}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative group rounded-2xl overflow-hidden bg-neutral-800 shadow-2xl border border-neutral-700"
                >
                  <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-neutral-700">
                    <span className="text-sm font-medium text-neutral-300">Page {img.page}</span>
                    <a href={img.url} target="_blank" rel="noreferrer" className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1">
                      View Full Size <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <img 
                    src={img.url} 
                    alt={`Limitless Search Page ${img.page}`} 
                    loading="lazy"
                    className="w-full h-auto object-contain bg-white"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// AI DECK BUILDER TAB
interface AgentLog {
  id: string;
  type: 'status' | 'text' | 'tool_call' | 'tool_result' | 'error' | 'done';
  message?: string;
  content?: string;
  name?: string;
  args?: any;
  result?: any;
}

function AIDeckBuilder() {
  const [idea, setIdea] = useState('I want a deck focused on Charizard ex that accelerates energy quickly and deals massive damage. Needs to be consistent.');
  const [building, setBuilding] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [finalDecklist, setFinalDecklist] = useState<string>('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || building) return;

    setBuilding(true);
    setLogs([]);
    setFinalDecklist('');

    try {
      const response = await fetch(`/api/agent/build-deck?idea=${encodeURIComponent(idea.trim())}`);
      
      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the last incomplete chunk

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr.trim() === '') continue;
            
            try {
              const data = JSON.parse(dataStr);
              setLogs(prev => [...prev, { ...data, id: Date.now().toString() + Math.random() }]);
              
              if (data.type === 'text') {
                setFinalDecklist(prev => prev + data.content);
              }
              if (data.type === 'done' || data.type === 'error') {
                setBuilding(false);
              }
            } catch (err) {
              console.error('Failed to parse JSON:', dataStr, err);
            }
          }
        }
      }
    } catch (err: any) {
      setLogs(prev => [...prev, { id: 'err', type: 'error', message: err.message }]);
      setBuilding(false);
    }
  };

  // Filter logs for the workspace view (notebook, tool calls)
  const workspaceLogs = logs.filter(l => l.type !== 'text' && l.type !== 'done');

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column: Input and Workspace */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Deck Idea
          </h2>
          <form onSubmit={handleBuild}>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your perfect deck..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none mb-4"
            />
            <button
              type="submit"
              disabled={building || !idea.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {building ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {building ? 'AI is Building...' : 'Generate Deck'}
            </button>
          </form>
        </div>

        {/* AI Workspace Terminal */}
        <div className="bg-[#0D1117] border border-neutral-800 rounded-2xl flex flex-col flex-grow h-[500px]">
          <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center gap-2 rounded-t-2xl">
            <Terminal className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-mono text-neutral-400">Agent Workspace</span>
            {building && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin ml-auto" />}
          </div>
          <div className="p-4 overflow-y-auto font-mono text-xs space-y-4 h-full scrollbar-thin scrollbar-thumb-neutral-700">
            {workspaceLogs.length === 0 && !building && (
              <div className="text-neutral-600 italic">Waiting for prompt...</div>
            )}
            {workspaceLogs.map((log) => (
              <div key={log.id} className="border-l-2 pl-3 py-1 border-neutral-800">
                {log.type === 'status' && (
                  <div className="text-indigo-400"># {log.message}</div>
                )}
                {log.type === 'tool_call' && (
                  <div className="text-emerald-400">
                    <span className="text-emerald-500 font-semibold">{log.name}</span>
                    <span className="text-neutral-500">(</span>
                    <span className="text-neutral-300">
                      {JSON.stringify(log.args, null, 2)}
                    </span>
                    <span className="text-neutral-500">)</span>
                  </div>
                )}
                {log.type === 'tool_result' && (
                  <div className="text-neutral-400 mt-1 pl-4 border-l border-neutral-800/50">
                    {/* truncate very long results */}
                    {'-> '} 
                    {JSON.stringify(log.result).length > 200 
                      ? JSON.stringify(log.result).substring(0, 200) + '... (truncated)' 
                      : JSON.stringify(log.result)}
                  </div>
                )}
                {log.type === 'error' && (
                  <div className="text-red-400">Error: {log.message}</div>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Right Column: Final Decklist */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl flex flex-col flex-grow min-h-[600px] shadow-xl">
          <div className="bg-neutral-700/30 border-b border-neutral-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-400" /> Decklist & Tactics
            </h2>
            {building && (
              <span className="text-xs text-rose-400 font-medium animate-pulse">Writing...</span>
            )}
          </div>
          <div className="p-6 overflow-y-auto h-full prose prose-invert prose-rose max-w-none prose-sm sm:prose-base">
            {!finalDecklist && !building && (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                <Code className="w-12 h-12 mb-4 opacity-20" />
                <p>The AI's final decklist will appear here.</p>
              </div>
            )}
            <ReactMarkdown 
              components={{
                img: ({node, ...props}) => (
                  <img 
                    {...props} 
                    className="inline-block w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.5rem)] lg:w-[calc(25%-0.5rem)] h-auto m-1 rounded-xl shadow-lg hover:scale-105 transition-transform bg-neutral-900 border border-neutral-700" 
                  />
                )
              }}
            >
              {finalDecklist}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
