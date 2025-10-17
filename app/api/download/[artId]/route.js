import { NextResponse } from 'next/server';
import { getArtworkById } from '@/lib/artworks';
import path from 'path';
import { readFile } from 'fs/promises';

export async function GET(req, { params }) {
    const { artId } = params;
    const artwork = getArtworkById(artId);

    if (!artwork) {
        return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    try {
        // Get the file from public folder
        const filePath = path.join(process.cwd(), 'public', artwork.downloadUrl);
        const fileBuffer = await readFile(filePath);

        // Return file for download
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="${artwork.title}.jpg"`,
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Download failed' }, { status: 500 });
    }
}