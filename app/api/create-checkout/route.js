import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Artwork data - same as in your frontend
const artworks = [
    { id: 'art-1', title: 'Dreamy Sunset', description: 'A beautiful sunset painting with vibrant colors', price: 45, priceId: 'price_xxx', type: 'digital', imageNum: 1 },
    { id: 'art-2', title: 'Butterfly Garden', description: 'Delicate butterflies in a magical garden', price: 65, priceId: 'price_yyy', type: 'digital', imageNum: 2 },
    { id: 'art-3', title: 'Moonlit Dreams', description: 'A serene moonlit landscape', price: 50, priceId: 'price_zzz', type: 'digital', imageNum: 3 },
    { id: 'art-4', title: 'Floral Fantasy', description: 'Vibrant flowers in full bloom', price: 75, priceId: 'price_aaa', type: 'physical', imageNum: 4 },
    { id: 'art-5', title: 'Pastel Clouds', description: 'Soft, dreamy clouds in pastel hues', price: 40, priceId: 'price_bbb', type: 'digital', imageNum: 5 },
    { id: 'art-6', title: 'Cherry Blossom', description: 'Delicate cherry blossoms in spring', price: 80, priceId: 'price_ccc', type: 'physical', imageNum: 6 },
    { id: 'art-7', title: 'Ocean Waves', description: 'Peaceful ocean waves at dawn', price: 55, priceId: 'price_ddd', type: 'digital', imageNum: 7 },
    { id: 'art-8', title: 'Mountain Peak', description: 'Majestic mountain landscape', price: 70, priceId: 'price_eee', type: 'digital', imageNum: 8 },
    { id: 'art-9', title: 'Starry Night', description: 'Beautiful starlit sky', price: 60, priceId: 'price_fff', type: 'digital', imageNum: 9 },
    { id: 'art-10', title: 'Rose Garden', description: 'Romantic rose garden scene', price: 65, priceId: 'price_ggg', type: 'physical', imageNum: 10 },
];

// Generate remaining artworks (11-56)
for (let i = 11; i <= 56; i++) {
    artworks.push({
        id: `art-${i}`,
        title: `Artwork ${i}`,
        description: `Beautiful artistic piece number ${i}`,
        price: Math.floor(Math.random() * (100 - 40 + 1) + 40),
        priceId: `price_${i}`,
        type: i % 3 === 0 ? 'physical' : 'digital',
        imageNum: i,
    });
}

export async function POST(req) {
    try {
        const { artId } = await req.json();

        // Find artwork
        const artwork = artworks.find(art => art.id === artId);

        if (!artwork) {
            return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: artwork.title,
                            description: artwork.description,
                        },
                        unit_amount: artwork.price * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            billing_address_collection: 'required',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
            metadata: {
                artId: artwork.id,
                artTitle: artwork.title,
                artImageNum: artwork.imageNum.toString(),
                artType: artwork.type,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Stripe checkout error:', err);
        return NextResponse.json({
            error: err.message || 'Failed to create checkout session'
        }, { status: 500 });
    }
}