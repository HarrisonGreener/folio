# Folio

**A clear lens for your money.**

Folio is a vision prototype for a clarity-first UK money app. It doesn't hold your cash. It sits over the banks you already use, splits each payday into purpose-built Vault Spaces, and shows where your money is heading.

**Live demo:** https://harrisongreener.github.io/folio/

Design, product and front-end by **Harrison Greener**.

## What's inside

- **Onboarding** in four steps: baseline flow, existing balances, commitments and intent.
- **Home**: portfolio net value, cash-flow analysis, and the portfolio architecture breakdown (Foundation, Accelerators, Frontier).
- **Vault Spaces**: logic containers for cash, ISAs, Premium Bonds and crypto, with detail views and growth projections.
- **Allocations**: income splits and round-ups that move money between spaces on payday.
- **Scope Lens**: describe a goal and get three approaches (stability, balanced, growth), each with a monthly amount, a date and the trade-offs.
- **Timeline**: projected position across 6 months to 10 years, separating wages from investment growth.

## Scope runs a free, open-source AI model in your browser

Scope's assistant uses [WebLLM](https://github.com/mlc-ai/web-llm) to run **Qwen 2.5 1.5B Instruct** (Apache-2.0) on your own device:

- No API key, no server, no cost.
- Nothing you type leaves your browser.
- About 1 GB downloads the first time you use Scope, then the browser caches it.
- Needs WebGPU (desktop Chrome or Edge, recent Safari). Elsewhere, Scope still works and shows exact calculated scenarios.

The money figures are always calculated in code (`src/services/scope.ts`); the model writes the explanation around them. That keeps the numbers right even with a small model.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide icons, WebLLM.

## Brand

Inter and Inter Black (−44 tracking, 1.4 line height). Ink `#0F0D0E`, Charcoal `#303030`, Copper `#B3593B`, Gold `#EAB308`, Green `#22C55E`, Paper `#FBFBFA`.

---

Prototype only. All accounts and figures are simulated. Nothing here is financial advice.
