import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ExternalLink, ChevronRight, Play, BookOpen, Sparkles, Terminal, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function App() {
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
}

interface AgentLog {
  id: string;
  type: 'status' | 'tool_call' | 'tool_result' | 'error' | 'text' | 'done';
  message?: string;
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
              rehypePlugins={[rehypeRaw]}
              components={{
                span: ({node, className, children, ...props}) => {
                  if (className === "card-hover") {
                    return <span className="group relative cursor-help inline-block ml-1" {...props}>{children}</span>;
                  }
                  if (className === "summary") {
                    return <span className="text-rose-400 hover:text-rose-300 font-semibold underline decoration-rose-500/30 decoration-dashed underline-offset-4" {...props}>{children}</span>;
                  }
                  if (className === "details") {
                    return (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-neutral-900 border border-neutral-700 p-4 rounded-xl shadow-2xl w-72 text-sm text-neutral-300 z-50 pointer-events-none text-left leading-relaxed">
                        {children}
                      </span>
                    );
                  }
                  return <span className={className} {...props}>{children}</span>;
                }
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
