# ShopMind — AI Shopping Agent
**Kasparro Hackathon 2026 | Track 1**

> ShopMind replaces the browse-search-filter-compare loop with a single intelligent conversation. Tell it what you need. It asks smart questions. It recommends the right product with clear reasoning.

---

## Demo Video
🎥 [Watch Demo](YOUR_YOUTUBE_LINK_HERE)

---

## Problem
Online shopping forces users through a painful loop: search → browse → filter → compare → still feel uncertain. Most users don't know exactly what to search for — they know what they need. ShopMind bridges that gap with conversation.

## Solution
A conversational AI shopping agent that:
- Understands natural language intent ("I need a gift for my dad who exercises")
- Asks smart clarifying questions (budget, occasion, preferences)
- Fetches relevant products from Shopify
- Recommends 2-3 options with explicit tradeoffs
- Explains why it recommends what it recommends

---

## Tech Stack
- **Frontend:** Next.js 16 + React + Tailwind CSS
- **Backend:** Next.js API Routes (server-side)
- **AI:** Google Gemini 2.5 Flash
- **Products:** Shopify Admin API (GraphQL)
- **Language:** TypeScript

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- A Shopify Partner account with a development store
- A Google AI Studio account (free)

### 1. Clone the repo
```bash
git clone https://github.com/adyapathak22/shopmind-agent
cd shopmind-agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```
GEMINI_API_KEY=your_gemini_api_key_from_aistudio.google.com
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_TOKEN=your_shopify_admin_api_token
```

**Getting your Gemini API key:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API Key" → "Create API key"
3. Copy the key

**Getting your Shopify Admin token:**
1. Go to your Shopify dev store admin
2. Settings → Apps and sales channels → Develop apps
3. Create an app → Configure Admin API scopes → enable `read_products`
4. Install app → API credentials → copy Admin API access token

### 4. Run the development server
```bash
npm run dev
```

### 5. Open in browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## How to Use
1. Type what you're looking for in plain language
2. Answer the agent's clarifying questions
3. Review the recommendations and tradeoffs
4. Ask follow-up questions if needed

**Example queries:**
- "I need shoes for a formal office environment"
- "Help me find a gift for someone who loves fitness, budget around $50"
- "I need something warm for winter, I'm going camping"
- "Show me something stylish but comfortable for everyday use"

---

## Repository Structure
```
shopmind-agent/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # AI conversation endpoint (Gemini)
│   │   └── products/route.ts   # Shopify product fetcher
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main chat UI
├── docs/
│   ├── product-doc.md          # Product thinking & decisions
│   ├── technical-doc.md        # Architecture & implementation
│   └── decision-log.md         # Running log of key decisions
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

---

## Screenshots
_(Add screenshots of the chat interface here)_

---

## Contribution Note

**Team:** Adya Pathak & Rupali Pasa | KIIT University, CSE Branch

This was a collaborative build where both team members contributed equally across product thinking and engineering.

**Adya Pathak:**
- Frontend development (chat UI, message rendering, UX design)
- AI layer integration (Gemini API, conversation prompt engineering)
- Product document and Technical document
- Demo video narration

**Rupali Pasa:**
- Backend development (Next.js API routes)
- Shopify Admin API integration (GraphQL queries, product fetching)
- Architecture design and  user journey design
- Decision log and scope decisions

**Joint contributions:**
- Product concept and problem framing
- Conversation flow design
- Testing and debugging
- README and submission preparation

Both team members spent approximately equal time on product thinking and engineering work throughout the hackathon.

---

## Documents
[Product Document](product-doc.md)
[Technical Document](technical-doc.md)
[Decision Log](decision-log.md)
