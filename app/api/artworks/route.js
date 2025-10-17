import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const artworksDir = path.join(process.cwd(), 'public', 'artworks');

        // Check if directory exists
        if (!fs.existsSync(artworksDir)) {
            return NextResponse.json([]);
        }

        // Read all files in the directory
        const files = fs.readdirSync(artworksDir);

        // Filter for image files and extract numbers
        const imageFiles = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
            })
            .map(file => {
                // Extract number from filename (e.g., "5.jpg" -> 5)
                const match = file.match(/^(\d+)\./);
                return {
                    filename: file,
                    number: match ? parseInt(match[1]) : 0
                };
            })
            .filter(item => item.number > 0) // Only keep numbered files
            .sort((a, b) => b.number - a.number); // Sort in descending order (newest first)

        // Convert to artwork objects
        const artworks = imageFiles.map(item => ({
            id: `art-${item.number}`,
            title: `Artwork #${item.number}`,
            description: `Beautiful digital art piece #${item.number}`,
            price: 45, // Default price - you can customize this
            priceId: 'price_default', // You'll need to set this up in Stripe
            type: 'digital',
            image: `/artworks/${item.filename}`,
            downloadUrl: `/artworks/${item.filename}`, // Same as image for now
        }));

        return NextResponse.json(artworks);
    } catch (error) {
        console.error('Error reading artworks:', error);
        return NextResponse.json({ error: 'Failed to load artworks' }, { status: 500 });
    }
}