import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const sessionId = url.searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json({ error: 'No session ID provided' }, { status: 400 });
        }

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Check if payment was successful
        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }

        // Return purchase data
        return NextResponse.json({
            artTitle: session.metadata.artTitle,
            artImage: session.metadata.artImage,
            downloadUrl: session.metadata.downloadUrl,
            customerEmail: session.customer_details.email,
            purchaseDate: new Date(session.created * 1000).toLocaleDateString(),
        });
    } catch (error) {
        console.error('Error verifying purchase:', error);
        return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }
}