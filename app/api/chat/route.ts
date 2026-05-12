import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { messages, products } = await request.json();

    const productContext = products?.length
      ? `Here are the available products in our store:\n${products
          .map((p: any) => `- ${p.title}: $${p.price} | Tags: ${p.tags?.join(', ')} | Description: ${p.description?.slice(0, 100)}`)
          .join('\n')}`
      : 'No products loaded yet.';

    const systemPrompt = `You are ShopMind, an intelligent shopping assistant for an online store. Your job is to help users find the perfect product through conversation.

${productContext}

Rules:
1. Ask smart clarifying questions to understand what the user needs (budget, use case, preferences)
2. Recommend 2-3 specific products from the list above with clear reasoning
3. Explain tradeoffs between options (price vs quality, features vs simplicity)
4. Keep responses concise and friendly
5. When recommending, format like: **Product Name** - $price - reason why it fits
6. Never recommend products not in the list above`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const allMessages = [
      { role: 'user' as const, parts: [{ text: systemPrompt }] },
      { role: 'model' as const, parts: [{ text: 'Understood! I am ShopMind, ready to help customers find perfect products.' }] },
      ...messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }],
      })),
    ];

    const chat = model.startChat({ history: allMessages });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error('Chat error:', error?.message || error);
    return NextResponse.json({ error: 'AI error', details: error?.message }, { status: 500 });
  }
}