/**
 * Scope's assistant runs an open-source model entirely in the browser with
 * WebLLM (Apache-2.0). No API key, no server, no cost. Weights download once
 * from Hugging Face and are cached by the browser.
 *
 * Model: Qwen2.5 1.5B Instruct (Apache-2.0), 4-bit quantised.
 */
import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import type { ScopeInput, ScopeProgress, computeScenarios } from './scope';

export const MODEL_ID = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
export const MODEL_LABEL = 'Qwen 2.5 · on-device';

let enginePromise: Promise<MLCEngineInterface> | null = null;

export const isLocalAISupported = (): boolean =>
  typeof navigator !== 'undefined' && 'gpu' in navigator;

export const isModelLoaded = (): boolean => loaded;
let loaded = false;

const getEngine = (onProgress?: ScopeProgress) => {
  if (!enginePromise) {
    enginePromise = import('@mlc-ai/web-llm').then(({ CreateMLCEngine }) =>
      CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (r) => onProgress?.('loading', r.progress ?? 0, r.text ?? ''),
      }),
    ).then((e) => { loaded = true; return e; })
      .catch((e) => { enginePromise = null; throw e; });
  }
  return enginePromise;
};

interface Narrative {
  estimate?: string;
  tradeOffs?: string[];
  growthHighlight?: string;
}

export const generateNarrative = async (
  input: ScopeInput,
  c: ReturnType<typeof computeScenarios>,
  onProgress?: ScopeProgress,
): Promise<Narrative | null> => {
  const engine = await getEngine(onProgress);
  onProgress?.('thinking', 1, 'Writing your scenarios');

  const facts = c.rows.map((r, i) =>
    `${i + 1}. ${r.title}: ${r.vault}, £${Math.ceil(r.monthly)}/month until ${r.date}, assumed ${(r.rate * 100).toFixed(1)}% a year, growth covers £${Math.ceil(r.growth)}.`,
  ).join('\n');

  const holdings = (input.externalPortfolio ?? []).map(a => `${a.name} £${a.value} (${a.volatility} volatility)`).join(', ') || 'none';

  const reply = await engine.chat.completions.create({
    temperature: 0.35,
    max_tokens: 420,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are Folio, a calm UK money planning assistant. Plain British English, no hype, no specific stocks or tokens, never give personal advice. Use only the numbers provided; do not invent figures. Reply with JSON only.',
      },
      {
        role: 'user',
        content:
`Goal: ${input.itemName}, target £${input.price}, timeframe ${input.timeframe || 'not given (assume 3 years)'}.
Income £${input.currentIncome}/month, savings £${input.currentSavings}. External holdings: ${holdings}.
Three paths, already calculated:
${facts}

Return JSON with:
"estimate": 2 sentences on feasibility and how their existing holdings affect risk,
"tradeOffs": array of 3 short sentences, one per path, on liquidity and risk,
"growthHighlight": max 10 words on why path 3 suits (or not) this timeframe.`,
      },
    ],
  });

  const text = reply.choices?.[0]?.message?.content ?? '';
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const parsed = JSON.parse(json) as Narrative;
  if (!Array.isArray(parsed.tradeOffs)) parsed.tradeOffs = [];
  return parsed;
};
