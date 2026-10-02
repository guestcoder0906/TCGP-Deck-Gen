import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as cheerio from 'cheerio';

import crypto from 'crypto';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

// Ensure screenshots directory exists
const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function startServer() {
  
function normalizeSet(setStr: string) {
  let s = setStr.toUpperCase();
  if (s.startsWith('PROMO')) {
    return 'P-' + s.replace(/^PROMO[-_]?/, '');
  }
  if (s.length === 2 && s[0] === 'P' && s[1] >= 'A' && s[1] <= 'Z') {
    return `P-${s[1]}`;
  }
  return s;
}

function isLogoOrInvalidImage(url: string) {
  if (!url) return true;
  const l = url.toLowerCase();
  return l.includes('limitless.png') || l.includes('mew.png') || l.includes('lweb.png') || l.includes('opdb.png') || l.includes('logo');
}

const cardCache = new Map<string, {title: string, text: string, image_url: string}>();
async function fetchCardInfo(id: string) {
  if (cardCache.has(id)) return cardCache.get(id)!;
  try {
    const parts = id.split('-');
    const set = normalizeSet(parts[0]);
    const num = parseInt(parts[1] || '1', 10);
    const url = `https://pocket.limitlesstcg.com/cards/${set}/${num}`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
    const text = $('.card-text-section').text().replace(/\s+/g, ' ').trim();
    let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property="og:image"]').attr('content') || '';
    if (isLogoOrInvalidImage(image_url)) image_url = '';
    if (image_url && !image_url.startsWith("http")) {
      image_url = new URL(image_url, url).href;
    }
    const data = { title, text, image_url };
    cardCache.set(id, data);
    return data;
  } catch (e) {
    return { title: id, text: 'Failed to load card', image_url: '' };
  }
}

const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Serve the screenshots directory
  app.use('/screenshots', express.static(screenshotsDir));

  app.get('/api/agent/build-deck', async (req, res) => {
    const deckIdea = req.query.idea as string;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (event: any) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const chat = ai.chats.create({
        model: 'gemini-3.5-flash-lite',
        config: {
          systemInstruction: `You are an AI Deck Builder for Pokémon TCG Pocket.
The AI will start by reading the deck idea entered by the user on the website and immediately opening an internal workspace notebook to log the primary win condition, required energy types, and core mechanics, while setting up a card counter starting at zero out of twenty. The AI must update this notebook before and after every single step it takes, as well as in between any steps, to ensure context is never lost and to actively track what it is doing with the deck prompt clearly at the top of its notes. Next, the AI will expand the deck idea into a comprehensive list of smart, hyper-specific search syntax queries tailored to finding the exact card text needed, such as using text:"draw", text:"discard", or specific type and trait keywords. During this query planning phase, the AI must intentionally identify and include the exact pre-evolutions required for any higher-stage or ex cards it plans to use, ensuring that if a Stage 1 or Stage 2 Pokémon is a target, its corresponding Basic forms are searched for as well to guarantee a fully legal and functional evolution line. Once the search terms are generated, the AI will execute the searches and scan the resulting overview pages, analyzing the grid layouts to map out the exact element positions and visual coordinates of the card images that look like strong candidates to select as potential options. The AI will log these selected candidate coordinate positions in its workspace notebook. After mapping out the candidates, the AI will systematically revisit the pages and explicitly click on those exact coordinate spots to extract and open the dedicated, full-screen view of each individual chosen card image. For every individual card the AI looks at from those spots, it will perform a deep analytical breakdown of its HP, attack costs, damage output, special abilities, retreat costs, and evolution stages, writing a text-based version of the card in its notebook to document exactly how it contributes to the deck's synergy. As the AI analyzes each card individually, it has the complete flexibility at any step or in between steps to evaluate whether to keep that specific card as a confirmed addition or to leave it behind and discard it from the notes if it is no longer needed or optimal for the deck. The AI will then filter these confirmed candidates through the strict deck-building rules of Pokémon TCG Pocket, making sure the final selection consists of exactly twenty cards with a balanced ratio of eight to twelve Pokémon and eight to twelve Trainer cards. The AI must include a foundational draw engine consisting of two copies of Professor's Research and two copies of Poké Ball to aggressively thin the miniature twenty-card deck, and it must verify that there are enough Basic Pokémon included to insulate the deck against an abrupt first-turn knockout loss. The AI will manually check all synergies against its notebook's notes, ensuring that high-retreat attackers are paired with cards like X Speed, Sabrina is a situational card and should generally only be included (1 copy usually) if you have damage-spreading attackers or a control strategy that specifically benefits from forcing switches (most decks do not need her), and appropriate tech trainer cards like Misty for example are added to manipulate damage math or energy acceleration. Throughout this entire process, the AI must use its notepad to track its current sub-task, maintain a live count and live text version of each card chosen and added to the deck, and double-check that no evolution lines are broken. Finally, once all conditions are met and the math perfectly totals twenty cards, the AI will compile the finalized selections from its notebook and output the complete plain-text decklist organized by card names and quantities along with a detailed tactical breakdown of how the deck executes its strategy.

Note: Since you don't have literal visual coordinates, pretend the URLs/links returned from the 'search_cards' tool are the "coordinates". Use 'view_card' with those URLs to inspect the cards.

CRITICAL:
1. Always update the notebook BEFORE executing a search, AFTER executing a search, BEFORE viewing a card, and AFTER viewing a card. To save time, you MUST execute these notebook updates in parallel with your searches and card views in the SAME turn.
2. MAX 2 COPIES PER CARD. You are strictly forbidden from including 3 or more of any card. A deck in Pokémon TCG Pocket can ONLY have a maximum of 2 copies of the same card!
3. STRICT DECKLIST FORMATTING: In your final response, you MUST output the decklist on a SINGLE LINE, separated by commas, under a "### Decklist" heading. Do NOT use bullet points or new lines for the decklist. For EVERY single card in the deck, immediately after its count and name (do NOT include its card set ID/number), append an inline HTML span block exactly as shown below to provide the card's details on hover. The details MUST contain the full card text (HP, attack costs, damage, abilities, retreat cost). Do NOT output ANY image URLs.
Example format:
### Decklist
2x Charizard EX <span class="card-hover"><span class="summary">[View Details]</span><span class="details">**HP**: 180<br/>**Attacks**: ...<br/>**Abilities**: ...</span></span>, 2x Charmander <span class="card-hover"><span class="summary">[View Details]</span><span class="details">...</span></span>
4. The final response MUST be a Markdown formatted decklist and tactical breakdown. Do not include raw notebook entries in the final text response, the notebook is managed via the tool.
5. SYNERGY, ANTI-SYNERGY & SMART SELECTION: You MUST carefully read what each card does (abilities, attacks, costs) and track everything carefully to create strong synergies. You MUST avoid anti-synergies or redundant effects (e.g., do not include an X Speed if your main Pokémon's retreat cost is already reduced to 0 by another card like Bombardier, do not include cards that affect types you aren't using). You MUST NOT just pick the first card you see. You MUST use search tools to evaluate ALL versions of a specific Pokémon (e.g. search for all 'Charmeleon' cards and compare them, picking the optimal one with the best ability/stats for your deck, like the one that gives fire energy upon evolving, rather than just the first one you find). You MUST use your meta deck knowledge to find the mathematically and strategically best Trainer cards (e.g., if you need healing, prioritize cards like 'Lucky Ice Pop' which has higher potential than a basic 'Potion'). ALWAYS look for meta deck patterns and anticipate synergies with specific items (e.g., if you are building a Fire deck, you should likely include Fire Patch since it's a staple in meta fire decks for energy acceleration). Make the absolute most of the strict 20-card space and do NOT settle for suboptimal cards. Be smart, keep track of all abilities and costs, use good search terms to find combo pieces, and ensure the 20 cards work together seamlessly without useless cards.
6. TIMEOUT PREVENTION: You only have a limited number of turns. To avoid timing out, you MUST execute multiple tool calls in PARALLEL in a single turn. For example, call view_card on multiple cards at once, and combine notebook_write calls with search_cards or view_card calls in the same turn. DO NOT waste turns doing only a single notebook_write.
7. NO ENERGY CARDS IN DECK: Do NOT include Energy cards in your decklist! Energy cards do not exist as deck cards in Pokémon TCG Pocket. Instead, Energy is generated automatically in the Energy Zone each turn based on the types you select for your deck. The 20 cards in the deck MUST only be Pokémon and Trainer cards.
8. META DECKS REFERENCE: You MUST use the 'search_meta_decks' and 'search_best_cards' tools as your VERY FIRST actions (with an empty search string) to look at ALL top meta decks and top 100 best cards in full detail (with each card's full text and abilities included). This will give you the baseline knowledge of what cards are good (like Ice Pops vs Potion) and how top tier decks are constructed. You MUST prioritize mimicking these meta deck patterns over making up your own strategies. Always search for ALL meta decks, and search variations if needed. Take notes of all good techniques, strategies, and patterns used in these meta decks in your notebook while making a new deck.
10. ENERGY ZONE DECLARATION AND POKÉMON TYPING: You MUST explicitly declare 1-3 Energy Types for the Energy Zone generation in your final output. Ensure the deck is energy-efficient and correct. The Pokémon you select MUST MATCH the Energy Types you declare. Do NOT include Pokémon that require different types of energy than what you have selected, or mix too many different types of Pokémon which makes the deck unplayable. Usually, sticking to exactly ONE main energy type for all your Pokémon (plus Colorless/Normal types) is the most efficient and makes the most sense. Anticipate energy requirements carefully: do NOT run 2 different types of energies if the main Pokémon require a lot of energy and you have no energy acceleration (unless it is a Dragon-type or another specific case that genuinely requires and works well with 2+ energy types).
11. EVOLUTION LINES & RARE CANDY: Do NOT forget evolutions of cards! If a basic Pokémon can evolve to become stronger (e.g., Charmeleon into Charizard), you MUST include the evolution line. If you are using a Stage 2 Pokémon, you MUST strongly consider using Rare Candy to speed up evolution. A recommended, space-efficient meta ratio for a Stage 2 line is 2 Basics, 1 Stage 1, 2 Stage 2s, and 2 Rare Candies. Only include just the basic form if the deck explicitly relies ONLY on that basic (e.g., Snorlax stall) and it is powerful enough on its own. Including a basic Pokémon without its evolution when it is clearly meant to be evolved does not make sense and is strictly forbidden.
12. MANDATORY FULL VARIANT EVALUATION & NO SKIPPING STEPS: You MUST NEVER skip evaluating card variants or settle for the first card version you find. When selecting ANY Pokémon (such as Charmeleon, Charmander, etc.), you MUST search for all versions of that card and inspect their abilities and stats. For example, always pick Charmeleon with the Ignition ability (which accelerates Fire Energy upon evolving) rather than a vanilla Charmeleon with no ability. Never be lazy: inspect all candidates, analyze their abilities, and ensure every card in the 20-card deck is the absolute smartest, highest-synergy choice possible.
`,
          tools: [{
            functionDeclarations: [
              {
                name: 'notebook_write',
                description: 'Write an entry to your internal workspace notebook. Use this to track the deck idea, progress, card candidates, counter (0/20), and decisions.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    entry: { type: Type.STRING, description: 'The text to append to your notebook' }
                  },
                  required: ['entry']
                }
              },
              {
                name: 'search_cards',
                description: 'Executes a search query on LimitlessTCG Pocket and returns a list of candidate cards with their URLs (treat these URLs as the "visual coordinates" to click on). Example queries: name:"pikachu ex", text:"draw", type:trainer, is:mega',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    query: { type: Type.STRING, description: 'The search syntax query' }
                  },
                  required: ['query']
                }
              },
                            {
                name: 'search_meta_decks',
                description: 'Fetches the top latest meta decks from the Chase-Mew GitHub tier list. Returns full details of each deck and its cards. You can optionally provide a search term (e.g. "snorlax ex") to filter the decks by deck name or card text/name.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    search: { type: Type.STRING, description: 'Optional search term to filter decks by pokemon name (e.g., "snorlax", "charizard"). Leave empty to get the top overall meta decks.' }
                  }
                }
              },
              {
                name: 'search_best_cards',
                description: 'Fetches the top 100 overall best and most popular individual cards in the current meta based on tournament data from GitHub.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {}
                }
              },
              {
                name: 'view_card',
                description: 'Opens the dedicated, full-screen view of an individual chosen card image (using its URL "coordinate") to extract its full text, stats, and abilities.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    url: { type: Type.STRING, description: 'The URL (coordinate) of the card to view' }
                  },
                  required: ['url']
                }
              }
            ]
          }]
        }
      });

      sendEvent({ type: 'status', message: 'Agent initialized' });

      let currentMessage = `User Deck Idea: ${deckIdea}\n\nBegin your process by opening your notebook and logging the primary win condition and setting up the 0/20 counter. Then proceed with the search planning.`;
      
      for (let turn = 0; turn < 60; turn++) { // safety limit
        sendEvent({ type: 'status', message: 'Agent thinking...' });
        
        let response: any;
        let retries = 0;
        while (true) {
          try {
            response = await chat.sendMessage({ message: currentMessage });
            break;
          } catch (e: any) {
            if (e?.status === 429 || e?.message?.includes('429') || e?.message?.includes('quota')) {
              if (retries > 3) throw e;
              sendEvent({ type: 'status', message: 'Rate limit hit, waiting...' });
              await new Promise(r => setTimeout(r, 10000));
              retries++;
            } else {
              throw e;
            }
          }
        }
        
        if (response.text) {
          sendEvent({ type: 'text', content: response.text });
        }

        if (!response.functionCalls || response.functionCalls.length === 0) {
          // No more function calls, agent is done
          break;
        }

        const functionResponses = [];
        
        for (const call of response.functionCalls) {
          sendEvent({ type: 'tool_call', name: call.name, args: call.args });
          
          let result: any = {};
          try {
            if (call.name === 'notebook_write') {
              // Emulate writing to notebook
              result = { success: true, logged: "Successfully written to notebook." };
                        } else if (call.name === 'search_best_cards') {
              const resScores = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/card-scores.json');
              const scores = await resScores.json();
              result = {
                total_top_cards: Math.min(scores.length, 100),
                top_cards: scores.slice(0, 100).map((c: any, index: number) => ({
                  rank: index + 1,
                  name: c.name,
                  score: c.score.toFixed(3),
                  popularity: c.popularity.toFixed(3)
                }))
              };
            } else if (call.name === 'search_meta_decks') {
              const rawSearch = (call.args?.search || call.args?.query || call.args?.term || '').toString().toLowerCase().trim();
              const resDecks = await fetch('https://raw.githubusercontent.com/chase-mew/pokemon-tcg-pocket-tier-list/main/public/data/best-decks.json');
              const decks = await resDecks.json();
              
              // Pre-fetch all unique cards across all decks in database
              const uniqueCardIds = new Set<string>();
              decks.forEach((d: any) => {
                (d.lists[0]?.cards || []).forEach((c: string) => {
                  const id = c.split(':')[1];
                  if (id) uniqueCardIds.add(id);
                });
              });
              
              const cardArr = [...uniqueCardIds];
              const cardDictionary: Record<string, any> = {};
              
              for (let i = 0; i < cardArr.length; i += 50) {
                const batch = cardArr.slice(i, i + 50);
                await Promise.all(batch.map(async (c) => {
                  if (c) {
                    const info = await fetchCardInfo(c);
                    cardDictionary[c] = info;
                  }
                }));
              }

              // Map ALL decks in database with full card details inline
              const detailedDecks = decks.map((d: any, index: number) => {
                const cleanName = d.name.replace(/[-_&]/g, ' ');
                return {
                  rank: index + 1,
                  name: d.name,
                  clean_name: cleanName,
                  cards: (d.lists[0]?.cards || []).map((c: string) => {
                    const [count, id] = c.split(':');
                    const info = cardDictionary[id] || { title: id, text: '', image_url: '' };
                    return {
                      count: parseInt(count, 10),
                      id,
                      title: info.title,
                      text: info.text,
                      image_url: info.image_url
                    };
                  })
                };
              });

              const genericTerms = ['', 'top', 'top 50', 'top50', 'top 100', 'all', 'best', 'meta', 'decks', 'deck', 'tierlist'];
              let filteredDecks = detailedDecks;
              let isFiltered = false;

              if (rawSearch && !genericTerms.includes(rawSearch)) {
                isFiltered = true;
                const queryWords = rawSearch.split(/\s+/).filter(Boolean);
                
                // 1. Strict match: all words match deck name or card info
                filteredDecks = detailedDecks.filter((d: any) => {
                  const deckText = (d.name + ' ' + d.clean_name).toLowerCase();
                  const cardTexts = d.cards.map((c: any) => (c.title + ' ' + c.text + ' ' + c.id).toLowerCase()).join(' ');
                  const combined = deckText + ' ' + cardTexts;
                  return queryWords.every((w: string) => combined.includes(w));
                });

                // 2. Partial match fallback: any word matches
                if (filteredDecks.length === 0) {
                  filteredDecks = detailedDecks.filter((d: any) => {
                    const deckText = (d.name + ' ' + d.clean_name).toLowerCase();
                    const cardTexts = d.cards.map((c: any) => (c.title + ' ' + c.text + ' ' + c.id).toLowerCase()).join(' ');
                    const combined = deckText + ' ' + cardTexts;
                    return queryWords.some((w: string) => combined.includes(w));
                  });
                }

                // 3. Fallback to all decks if still no matches so it is NEVER empty
                if (filteredDecks.length === 0) {
                  filteredDecks = detailedDecks;
                  isFiltered = false;
                }
              }

              result = { 
                total_in_database: detailedDecks.length,
                matched_count: filteredDecks.length, 
                search_term: rawSearch || 'all_meta_decks',
                is_filtered: isFiltered,
                decks: filteredDecks
              };
            } else if (call.name === 'search_cards') {
              const q = call.args.query as string;
              const res = await fetch(`https://pocket.limitlesstcg.com/cards/?q=${encodeURIComponent(q)}`);
              const html = await res.text();
              const $ = cheerio.load(html);
              const cards: {name: string, url: string, image_url: string}[] = [];
              $('a[href*="/cards/"]').each((_, el) => {
                const href = $(el).attr('href');
                if (!href || href === '/cards' || href === '/cards/') return;
                const url = href.startsWith('http') ? href : `https://pocket.limitlesstcg.com${href}`;
                let image_url = $(el).find('img').attr('src') || '';
                if (image_url && !image_url.startsWith('http')) {
                  image_url = new URL(image_url, url).href;
                }
                if (isLogoOrInvalidImage(image_url)) {
                  image_url = '';
                }
                let name = $(el).find('img').attr('alt') || $(el).attr('title') || $(el).text().trim() || '';
                if (!name) {
                  name = 'Card ' + url.split('/').filter(Boolean).slice(-2).join('/');
                }
                if (!cards.some(c => c.url === url)) {
                  cards.push({ name, url, image_url });
                }
              });
              result = { found: cards.length, candidates: cards.slice(0, 15) }; // limit to 15 to save context
            } else if (call.name === 'view_card') {
              let url = call.args.url as string;
              if (!url.startsWith('http')) url = `https://pocket.limitlesstcg.com${url}`;
              
              const match = url.match(/\/cards\/([^\/]+)\/(\d+)/i);
              if (match) {
                const set = normalizeSet(match[1]);
                const num = match[2];
                url = `https://pocket.limitlesstcg.com/cards/${set}/${num}`;
              }

              const res = await fetch(url);
              const html = await res.text();
              const $ = cheerio.load(html);
              const title = $('title').text().replace(' – Limitless TCG Pocket Database', '');
              const text = $('.card-text-section').text().replace(/\s+/g, ' ').trim();
              let image_url = $('.card-image img').attr('src') || $('.card img').attr('src') || $('meta[property="og:image"]').attr('content') || '';
              if (isLogoOrInvalidImage(image_url)) image_url = '';
              if (image_url && !image_url.startsWith("http")) {
                image_url = new URL(image_url, url).href;
              }
              result = { title, card_text: text, image_url };
            } else {
              result = { error: "Unknown tool" };
            }
          } catch (e: any) {
            result = { error: e.message };
          }
          
          sendEvent({ type: 'tool_result', name: call.name, result });
          
          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: result,
              id: call.id
            }
          });
        }
        
        // Wait a bit to avoid hitting rate limits
        await new Promise(r => setTimeout(r, 4500));
        
        // Pass function results back to Gemini
        currentMessage = functionResponses as any; 
      }
      
      sendEvent({ type: 'done' });
      res.end();
    } catch (err: any) {
      console.error(err);
      sendEvent({ type: 'error', message: err.message });
      res.end();
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
