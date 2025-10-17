// This file is kept for backwards compatibility
// The actual artwork loading is now done via the API

export async function getArtworkById(id) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/artworks`);
        const artworks = await response.json();
        return artworks.find(art => art.id === id);
    } catch (error) {
        console.error('Error fetching artwork:', error);
        return null;
    }
}