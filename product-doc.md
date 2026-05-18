# ShopMind — Product Document
**Kasparro Hackathon 2026 | Track 1: AI Shopping Agent**
**Team:** [Your Name 1] & [Your Name 2] | KIIT University, CSE
**Date:** May 2026

---

## 1. The Problem

Online shopping is broken for most users. The current experience forces people through a painful loop:

1. Search with keywords that may not match product names
2. Browse hundreds of results
3. Apply filters manually
4. Compare products across multiple tabs
5. Still feel uncertain about the final choice

This loop assumes users know exactly what they want and how to describe it. Most don't. A user who wants "something comfortable for long office hours" doesn't know to search "ergonomic lumbar support mesh chair." They just know what they need — and the current interface fails them.

**The core insight:** Shopping is fundamentally a conversation. When you walk into a good store, an assistant asks questions, understands your context, and guides you to the right product. E-commerce has never replicated this.

---

## 2. Who We're Building For

**Primary user: The uncertain shopper**
- Knows what they need but not what to search for
- Overwhelmed by too many options
- Wants a recommendation they can trust, with reasoning

**Secondary user: The gift buyer**
- Shopping for someone else
- Has constraints (budget, occasion, recipient preferences)
- Needs help narrowing down quickly

**Current experience:**
User visits a Shopify store → searches vaguely → gets 200 results → filters blindly → gives up or buys something mediocre.

**Desired experience:**
User types what they need in plain language → agent asks 2-3 smart questions → agent recommends 2-3 products with clear reasoning and tradeoffs → user buys with confidence.

---

## 3. What We Built

**ShopMind** is a conversational AI shopping agent that replaces the browse-search-filter-compare loop with a single intelligent conversation.

### Core User Journey

```
User opens ShopMind
        ↓
Types a natural language need
("I need shoes for the office, something formal")
        ↓
Agent asks 1-2 clarifying questions
("What's your budget? Do you prefer leather or synthetic?")
        ↓
User answers conversationally
        ↓
Agent fetches relevant products from Shopify
        ↓
Agent recommends 2-3 options with explained tradeoffs
("Chelsea Boots at $119 are more versatile, Oxford Shoes at $134 are more formal")
        ↓
User makes an informed decision
```

### What Makes It Different From Search

| Traditional Search | ShopMind |
|-------------------|----------|
| Keyword matching | Intent understanding |
| Shows everything | Narrows intelligently |
| User filters manually | Agent asks smart questions |
| No reasoning | Explains why it recommends |
| Static results | Conversational follow-ups |

---

## 4. Key Product Decisions

### Decision 1: Conversation-first, not search-first
**What we chose:** Start with a blank chat input, no search bar, no filters.
**Why:** Forcing users through a search bar immediately constrains their thinking. Conversation lets them express need naturally.
**Tradeoff:** Users unfamiliar with chat interfaces may need a moment to adjust. We mitigated this with a clear welcome message and example prompts.

### Decision 2: Ask before recommending
**What we chose:** Agent always asks at least one clarifying question before showing products.
**Why:** Without context, recommendations are just keyword matching. One question about budget or use case dramatically improves recommendation quality.
**Tradeoff:** Adds one round-trip to the conversation. We kept questions to max 2 to avoid fatigue.

### Decision 3: Always explain recommendations
**What we chose:** Every product recommendation includes a reason why it fits and how it compares to alternatives.
**Why:** Users don't just want a list — they want confidence. Explaining reasoning builds trust and reduces decision anxiety.
**Tradeoff:** Longer responses. We kept explanations concise (1-2 sentences per product).

### Decision 4: Show tradeoffs explicitly
**What we chose:** When recommending multiple products, always state the tradeoff between them.
**Why:** "Chelsea Boots are more versatile, Oxford Shoes are more formal" is infinitely more useful than just showing both.
**Tradeoff:** Requires the AI to reason about product differences, not just list them.

---

## 5. What We Chose NOT to Build

| Feature | Why we skipped it |
|---------|-------------------|
| User accounts / login | Out of scope for hackathon; adds complexity without improving core demo |
| Cart integration | Shopify dev store limitations; focus was on recommendation quality |
| Product images in chat | CSV import didn't include images; didn't affect conversation quality |
| Voice input | Adds complexity; text conversation demonstrates the concept clearly |
| Multi-store support | Single store is sufficient to prove the concept |
| Filters/sorting UI | Deliberately excluded — the whole point is conversation replaces filters |

---

## 6. Tradeoffs Encountered

**Gemini free tier rate limits**
We hit rate limits during development with multiple Gemini model versions. We resolved this by using `gemini-2.5-flash`, the latest stable free model, and adding proper error handling so the UI degrades gracefully.

**Shopify Admin API vs Storefront API**
We used the Admin API (with token auth) rather than the Storefront API because it provided easier access to product data without requiring a separate OAuth flow for a dev store setup. Tradeoff: Admin token should never be exposed client-side — we kept all Shopify calls server-side in Next.js API routes.

**20 vs 100 products in context**
Sending all 100 products to the AI in every request increases latency and token usage. We currently send all products but truncate descriptions to 100 characters. A production version would use semantic search to pre-filter relevant products before sending to the AI.

---

## 7. Success Metrics (If This Were Real)

- Conversation-to-click rate (user clicks a recommended product)
- Session length (more turns = higher engagement)
- Recommendation acceptance rate
- Time-to-decision vs traditional search

---

## 8. What We'd Build Next

1. **Semantic product search** — use embeddings to pre-filter relevant products before sending to AI, improving speed and accuracy
2. **Cart integration** — let users add recommended products directly from the chat
3. **Multi-merchant support** — the core Kasparro use case: one agent across multiple Shopify stores
4. **Preference memory** — remember user's style, size, and budget across sessions
5. **Image support** — show product images inline in the conversation
