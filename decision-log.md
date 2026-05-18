# ShopMind — Decision Log
**Kasparro Hackathon 2026 | Track 1: AI Shopping Agent**

This is a running log of key decisions made during the build. Format: "We considered X, chose Y, because Z."

---

## Product Decisions

### D1 — Track Selection
**Considered:** All 5 tracks
**Chose:** Track 1 — AI Shopping Agent
**Because:** Most demo-able in a short video. Clear user journey. Directly relevant to Kasparro's commerce infrastructure business. We could show a real end-to-end conversation in under 3 minutes.

---

### D2 — Product Category
**Considered:** Building a niche store (e.g. only shoes, only electronics)
**Chose:** Multi-category store (clothing, shoes, accessories, sports, camping)
**Because:** A multi-category store makes the agent's intent-understanding more impressive. "I need a gift for my dad who exercises" is a harder and more realistic query than "show me running shoes." Harder queries = better demo of AI capability.

---

### D3 — Conversation Design: Ask First vs Recommend First
**Considered:** Immediately returning product results when user types a query
**Chose:** Agent always asks at least one clarifying question before recommending
**Because:** Returning immediate results is just search with a chat wrapper. Asking questions is what makes this an agent. The judges explicitly look for "understands user intent deeply — asks smart follow-up questions instead of showing everything."

---

### D4 — No Filters or Search Bar
**Considered:** Adding a traditional search bar or filter panel alongside the chat
**Chose:** Chat only — no search bar, no filters
**Because:** Including filters would undermine the product thesis. The entire point is that conversation replaces filters. Adding both would confuse the UX and suggest we don't believe in our own concept. Scope decision: conversation-first, nothing else.

---

### D5 — Recommendation Format
**Considered:** Showing product cards with images vs plain text recommendations
**Chose:** Plain text with bold product names and prices, with explicit tradeoff explanation
**Because:** Images weren't available in our product CSV. More importantly, the quality of reasoning matters more than the visual presentation for the hackathon demo. We prioritized "explains why it recommends what it recommends" over visual polish.

---

## Technical Decisions

### D6 — Framework: Next.js vs Separate Frontend + Backend
**Considered:** React frontend + separate Express/FastAPI backend
**Chose:** Next.js with API routes (full-stack in one repo)
**Because:** Next.js API routes give us server-side code (for secret keys) without running a separate server. Single repo = cleaner git history. Faster to build. No CORS configuration needed.

---

### D7 — AI Provider: Anthropic Claude vs Google Gemini
**Considered:** Claude API (Anthropic), Gemini (Google), OpenAI GPT
**Chose:** Google Gemini 2.5 Flash
**Because:** Claude API requires paid credits — we didn't have API credits during the hackathon. Gemini has a generous free tier (no credit card required). Gemini 2.5 Flash is fast, capable, and free. GPT was excluded for the same billing reason as Claude.
**Tradeoff:** Gemini free tier has rate limits (~15 req/min). We hit these during development and had to handle 429 errors gracefully.

---

### D8 — Shopify API: Admin API vs Storefront API
**Considered:** Shopify Storefront API (public, token-based), Shopify Admin API (private, token-based)
**Chose:** Shopify Admin API
**Because:** For a development store, the Admin API gives direct product access with a simple token. The Storefront API required additional configuration steps for our dev store setup. Since all our Shopify calls are server-side (never exposed to browser), using the Admin token is safe.
**Tradeoff:** Admin token has higher privilege than needed. A production system should use the Storefront API with minimal scopes.

---

### D9 — Product Context: Send All vs Pre-filter
**Considered:** Sending all 100 products to Gemini in every request vs using semantic search to pre-filter relevant products
**Chose:** Send all products (truncated descriptions) in every request
**Because:** Simpler to implement. 100 products at ~100 chars each = ~10,000 tokens of context, well within Gemini's limits. Pre-filtering with embeddings would require a vector database (Pinecone, Supabase) — out of scope for hackathon timeline.
**Tradeoff:** Higher token usage per request. Latency increases slightly. Not scalable to 10,000+ products.

---

### D10 — State Management: Frontend vs Backend
**Considered:** Storing conversation history on the server (Redis/database) vs in React state on the frontend
**Chose:** Frontend state (React useState)
**Because:** No database needed. Simpler architecture. Gemini has no memory between requests anyway — we have to send history in every request regardless of where we store it. For a hackathon demo with no user accounts, frontend state is the right call.
**Tradeoff:** Conversation resets on page refresh. No persistence across sessions.

---

### D11 — Error Handling Strategy
**Considered:** Letting errors crash silently vs showing error states to user
**Chose:** Catch all errors, return friendly fallback messages, log details server-side
**Because:** The judges will test failure scenarios. A system that fails gracefully shows engineering maturity. "Sorry, something went wrong. Please try again!" is better than a blank screen or a stack trace.

---

### D12 — Deployment: Local vs Vercel
**Considered:** Deploying to Vercel for a live URL
**Chose:** Local development (localhost:3000) for submission
**Because:** Deployment adds complexity and potential for things to break during the demo window. A working local demo is better than a broken deployed one. We can deploy after the hackathon if needed.

---

## Scope Decisions (What We Didn't Build)

| Feature | Decision | Reason |
|---------|----------|--------|
| User authentication | Skipped | Out of scope; no multi-user requirements for hackathon |
| Cart/checkout | Skipped | Dev store limitation; focus on recommendation quality |
| Product images | Skipped | CSV didn't include image URLs; didn't affect conversation quality |
| Streaming responses | Skipped | Adds complexity; batch responses work fine for demo |
| Voice input | Skipped | Text conversation demonstrates the concept clearly |
| Analytics/tracking | Skipped | No backend database; out of scope |
| Multi-language | Skipped | English-only is sufficient for demo |
