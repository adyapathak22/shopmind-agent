import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    const shopifyQuery = `
      {
        products(first: 100, query: "${query}") {
          edges {
            node {
              id
              title
              description
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              onlineStoreUrl
            }
          }
        }
      }
    `;

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN!,
        },
        body: JSON.stringify({ query: shopifyQuery }),
      }
    );

    const data = await response.json();
    const products = data.data?.products?.edges?.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      tags: edge.node.tags,
      price: (parseFloat(edge.node.priceRange.minVariantPrice.amount) / 100).toFixed(2),
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
      image: edge.node.images.edges[0]?.node.url || null,
      url: edge.node.onlineStoreUrl,
    })) || [];

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products', products: [] }, { status: 500 });
  }
}