'use client';
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Mail, Facebook, Sparkles, Loader2, MessageCircle } from 'lucide-react';

export default function ArtPortfolio() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [loading, setLoading] = useState(null);
  const [showContactModal, setShowContactModal] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load artworks and favorites
  useEffect(() => {
    loadArtworks();
    loadFavorites();
  }, []);

  const loadArtworks = async () => {
    try {
      const response = await fetch('/api/artworks');
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error('Error loading artworks:', error);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (artId) => {
    let newFavorites;
    if (favorites.includes(artId)) {
      newFavorites = favorites.filter(id => id !== artId);
    } else {
      newFavorites = [...favorites, artId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handlePurchase = async (art) => {
    setLoading(art.id);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artId: art.id }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
        setLoading(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  const handleContactForPurchase = (art) => {
    setShowContactModal(art);
  };

  const sendContactEmail = (art) => {
    const subject = encodeURIComponent(`Interested in: ${art.title}`);
    const body = encodeURIComponent(`Hi Shweta,\n\nI'm interested in purchasing "${art.title}" (Art #${art.id.replace('art-', '')}).\n\nPlease let me know about availability and any additional details.\n\nThank you!`);
    window.location.href = `mailto:shwetaparna111@gmail.com?subject=${subject}&body=${body}`;
    setShowContactModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-pink-400" size={28} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                WhiteLeafs Art
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <a href="mailto:shwetaparna111@gmail.com" className="text-pink-600 hover:text-pink-700 transition">
                <Mail size={24} />
              </a>
              <a href="https://www.facebook.com/share/15XBCS2WNf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 transition">
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to My Creative Space
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Where dreams become art ✨
        </p>
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-gray-700 font-semibold">
            🎨 Instant Digital Downloads • Secure Payment • Email Delivery
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {artworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading artworks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div
                  className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                  onClick={() => setSelectedArt(art)}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{art.title}</h3>
                    <button
                      onClick={() => toggleFavorite(art.id)}
                      className="transition"
                    >
                      <Heart
                        className={`${favorites.includes(art.id)
                            ? 'fill-pink-400 text-pink-400'
                            : 'text-pink-400'
                          } hover:fill-pink-400`}
                        size={20}
                      />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{art.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-pink-600">${art.price}</span>
                    <span className="text-sm text-gray-500 bg-purple-100 px-3 py-1 rounded-full">
                      Digital Art
                    </span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePurchase(art)}
                      disabled={loading === art.id}
                      className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading === art.id ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          <span>Buy Now</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleContactForPurchase(art)}
                      className="w-full bg-white border-2 border-pink-300 text-pink-600 py-3 rounded-full font-semibold hover:bg-pink-50 transition flex items-center justify-center space-x-2"
                    >
                      <MessageCircle size={20} />
                      <span>Contact for Purchase</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works 💫</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-4">1️⃣</div>
            <h3 className="font-bold text-lg mb-2">Choose Your Art</h3>
            <p className="text-gray-600 text-sm">Browse and select the perfect piece from my collection</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-4">2️⃣</div>
            <h3 className="font-bold text-lg mb-2">Secure Checkout</h3>
            <p className="text-gray-600 text-sm">Complete your purchase safely through Stripe</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-4">3️⃣</div>
            <h3 className="font-bold text-lg mb-2">Get Your Art</h3>
            <p className="text-gray-600 text-sm">Receive instant email with download link!</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">About My Art</h2>
          <p className="text-gray-600 text-center leading-relaxed mb-4">
            Hi! I'm Shweta, a digital and traditional artist creating dreamy, aesthetic pieces inspired by nature,
            emotions, and all things beautiful. Each piece is created with love and attention to detail.
          </p>
          <p className="text-gray-600 text-center leading-relaxed">
            <strong>Digital downloads</strong> are delivered instantly via email in high-resolution format.
            Feel free to contact me directly for custom commissions or inquiries! 💕
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Let's Connect!</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center">
              <Mail className="mx-auto mb-3 text-pink-500" size={32} />
              <h3 className="font-bold text-lg mb-2">Email Me</h3>
              <p className="text-gray-600 text-sm mb-4">For commissions & inquiries</p>
              <a href="mailto:shwetaparna111@gmail.com" className="text-pink-600 hover:text-pink-700 font-semibold break-all">
                shwetaparna111@gmail.com
              </a>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <Facebook className="mx-auto mb-3 text-pink-500" size={32} />
              <h3 className="font-bold text-lg mb-2">Follow Me</h3>
              <p className="text-gray-600 text-sm mb-4">See my latest creations</p>
              <a href="https://www.facebook.com/share/15XBCS2WNf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-semibold">
                WhiteLeafs Art
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for selected artwork */}
      {selectedArt && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArt(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedArt.image}
                alt={selectedArt.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedArt.title}</h3>
            <p className="text-gray-600 mb-4">{selectedArt.description}</p>
            <div className="bg-pink-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>What you'll get:</strong><br />
                • High-resolution digital file<br />
                • Instant email delivery with download link<br />
                • Lifetime download access<br />
                • Personal use license included
              </p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-pink-600">${selectedArt.price}</span>
              <span className="text-sm text-gray-500 bg-purple-100 px-4 py-2 rounded-full">
                Digital Art
              </span>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  handlePurchase(selectedArt);
                  setSelectedArt(null);
                }}
                disabled={loading === selectedArt.id}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading === selectedArt.id ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Buy Now</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  handleContactForPurchase(selectedArt);
                  setSelectedArt(null);
                }}
                className="w-full bg-white border-2 border-pink-300 text-pink-600 py-3 rounded-full font-semibold hover:bg-pink-50 transition flex items-center justify-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Contact for Purchase</span>
              </button>
              <button
                onClick={() => setSelectedArt(null)}
                className="bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="mx-auto text-pink-500 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Me</h3>
            <p className="text-gray-600 mb-6 text-center">
              Interested in <strong>{showContactModal.title}</strong>?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => sendContactEmail(showContactModal)}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-full font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Mail size={20} />
                <span>Send Email</span>
              </button>
              <button
                onClick={() => setShowContactModal(null)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-pink-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 mb-2">
            Made with 💕 by Shweta
          </p>
          <p className="text-sm text-gray-500">
            All artwork © 2025 WhiteLeafs Art • Secure payments by Stripe
          </p>
        </div>
      </footer>
    </div>
  );
}