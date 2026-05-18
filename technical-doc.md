# ShopMind — Technical Document
**Kasparro Hackathon 2026 | Track 1: AI Shopping Agent**
**Team:** [Your Name 1] & [Your Name 2] | KIIT University, CSE

---

## 1. System Overview

ShopMind is a full-stack conversational shopping agent built with Next.js. It connects a chat UI to Shopify's product catalog via the Admin API, uses Google Gemini to reason over products and conduct conversations, and returns structured recommendations to the user.

**One-line architecture:** Browser → Next.js frontend → Next.js API routes → [Shopify Admin API + Gemini API] → response back to browser.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  ┌─────────────────────────────────────────┐    │
│  │         Chat UI (React/Next.js)          │    │
│  │  - Message history state                 │    │
│  │  - Input handler                         │    │
│  │  - Product context (loaded on mount)     │    │
│  └────────────┬──────────────┬─────────────┘    │
└───────────────┼──────────────┼──────────────────┘
                │              │
         POST /api/chat   GET /api/products
                │              │
┌───────────────┼──────────────┼──────────────────┐
│            Next.js Server (API Routes)           │
│  ┌─────────────────┐  ┌─────────────────────┐   │
│  │  /api/chat      │  │  /api/products      │   │
│  │  - Builds       │  │  - GraphQL query    │   │
│  │    system prompt│  │  - Formats product  │   │
│  │  - Manages      │  │    data             │   │
│  │    chat history │  │  - Returns JSON     │   │
│  │  - Calls Gemini │  └────────┬────────────┘   │
│  └────────┬────────┘           │                 │
└───────────┼────────────────────┼─────────────────┘
            │                    │
    ┌───────▼──────┐    ┌───────▼──────────┐
    │  Gemini API  │    │  Shopify Admin   │
    │  (AI layer)  │    │  API (GraphQL)   │
    └──────────────┘    └──────────────────┘
```

---

## 3. Components

### 3.1 Frontend — `app/page.tsx`
- React client component with `'use client'` directive
- State: `messages[]`, `input`, `loading`, `products[]`
- On mount: fetches all products from `/api/products` and stores in state
- On send: appends user message → calls `/api/chat` with full message history + product list → appends AI response
- Renders bold text from `**markdown**` syntax inline
- Auto-scrolls to latest message using `useRef`

### 3.2 Products API — `app/api/products/route.ts`
- GET endpoint
- Queries Shopify Admin GraphQL API for up to 100 products
- Returns: id, title, description (truncated), tags, price, currency, image URL
- Price is parsed from string to float and formatted to 2 decimal places
- Runs server-side only — Shopify token never exposed to browser

### 3.3 Chat API — `app/api/chat/route.ts`
- POST endpoint
- Receives: full message history + product list from frontend
- Builds a system prompt that includes all product data as context
- Uses Gemini's chat history format (role: user/model)
- Injects system prompt as the first exchange in chat history
- Calls `gemini-2.5-flash` via `@google/generative-ai` SDK
- Returns AI response text as JSON

---

## 4. AI / Deterministic Boundary

This is an explicit design decision in our system:

| What AI (Gemini) handles | What deterministic code handles |
|--------------------------|--------------------------------|
| Understanding user intent | Fetching products from Shopify |
| Asking clarifying questions | Formatting product data |
| Reasoning over product options | Parsing prices |
| Explaining tradeoffs | Managing API auth |
| Generating recommendations | Error handling & fallbacks |
| Maintaining conversation context | Rate limit detection |

**Why this boundary?** The AI is good at reasoning and language. It is bad at reliably fetching data or doing arithmetic. We never ask Gemini to fetch products or calculate prices — we give it the data and ask it to reason about it.

---

## 5. Key Implementation Decisions

### 5.1 Server-side API calls only
All calls to Shopify and Gemini happen in Next.js API routes (server-side), never in the browser. This means:
- API keys are never exposed in the client bundle
- No CORS issues with third-party APIs
- Centralized error handling

### 5.2 Full product context in every request
We send all products to Gemini in every chat request as part of the system prompt. This is simple and works well for 100 products.

**Tradeoff:** Higher token usage per request. At scale, we would use vector embeddings to retrieve only the top-K relevant products before passing to the AI.

### 5.3 Chat history management
We maintain full conversation history in React state on the frontend and send it with every request. Gemini has no memory between API calls — the frontend owns the conversation state.

**Tradeoff:** Large conversations = larger payloads. For a hackathon demo this is fine. In production, we'd truncate to the last N turns or summarize older context.

### 5.4 System prompt injection via chat history
Gemini's SDK doesn't support a dedicated system prompt field in the same way as some other APIs. We inject our system prompt as the first user/model exchange in the chat history. This is the recommended pattern for this SDK version.

---

## 6. Failure Handling

### 6.1 Shopify API failure
```typescript
try {
  const response = await fetch(shopifyEndpoint, {...});
  // parse and return products
} catch (error) {
  return NextResponse.json(
    { error: 'Failed to fetch products', products: [] },
    { status: 500 }
  );
}
```
If Shopify is down, the products endpoint returns an empty array. The chat UI will still render but the agent will have no product context. The frontend shows "0 products loaded" in the header as a visible signal.

### 6.2 Gemini API failure / rate limits
```typescript
} catch (error: any) {
  console.error('Chat error:', error?.message || error);
  return NextResponse.json(
    { error: 'AI error', details: error?.message },
    { status: 500 }
  );
}
```
The frontend catches this and shows a friendly error message: "Sorry, something went wrong. Please try again!" This keeps the UI usable even if the AI is temporarily unavailable.

### 6.3 Rate limiting (429)
The free Gemini tier has strict rate limits. When hit, the error is caught and returned to the user as a friendly message. In production, we would implement exponential backoff with retry logic.

### 6.4 Malformed AI response
If Gemini returns an unexpected format, `result.response.text()` will return an empty string or throw. The catch block handles this and returns the fallback error message.

---

## 7. Known Limitations

| Limitation | Impact | Fix in production |
|-----------|--------|-------------------|
| Free Gemini tier rate limits | ~15 req/min max | Paid tier or request queuing |
| All products sent in every request | Higher latency at scale | Vector search pre-filtering |
| No cart integration | Can't complete purchase in app | Shopify Storefront API cart mutation |
| No persistent memory | Preferences reset each session | Database + user auth |
| Dev store only | Not a real merchant | Deploy with real merchant credentials |
| No streaming responses | User waits for full response | Gemini streaming API |

---

## 8. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 16 + React | Full-stack framework, API routes built-in |
| Styling | Tailwind CSS | Fast, utility-first, no custom CSS needed |
| AI | Google Gemini 2.5 Flash | Free tier, strong reasoning, fast responses |
| Products | Shopify Admin API (GraphQL) | Direct product access for dev store |
| Language | TypeScript | Type safety, better developer experience |
| Deployment | Local (localhost:3000) | Hackathon scope |

---

## 9. Setup Instructions

```bash
# Clone the repo
git clone https://github.com/adyapathak22/shopmind-agent
cd shopmind-agent

# Install dependencies
npm install

# Create environment file
# Create .env.local with the following:
GEMINI_API_KEY=your_gemini_api_key
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_TOKEN=your_shopify_admin_token

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

---

## 10. Repository Structure

```
shopmind-agent/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts        # AI conversation endpoint
│   │   └── products/
│   │       └── route.ts        # Shopify product fetcher
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main chat UI
├── docs/
│   ├── product-doc.md
│   ├── technical-doc.md
│   └── decision-log.md
├── public/
├── .env.local                  # Not committed (secrets)
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```
