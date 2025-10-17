import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { artId } = await req.json();

        const artworksResponse = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/artworks');
        const artworks = await artworksResponse.json();
        const artwork = artworks.find(art => art.id === artId);

        if (!artwork) {
            return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: artwork.title,
                            description: artwork.description,
                            images: [process.env.NEXT_PUBLIC_APP_URL + artwork.image],
                        },
                        unit_amount: artwork.price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: undefined,
            billing_address_collection: 'required',
            success_url: process.env.NEXT_PUBLIC_APP_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.NEXT_PUBLIC_APP_URL,
            metadata: {
                artId: artwork.id,
                artTitle: artwork.title,
                downloadUrl: artwork.downloadUrl,
                artImage: artwork.image,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Stripe checkout error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}