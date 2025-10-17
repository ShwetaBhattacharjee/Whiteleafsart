'use client';
import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DownloadPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchaseData, setPurchaseData] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (sessionId) {
            fetchPurchaseData();
        } else {
            setError('Invalid download link');
            setLoading(false);
        }
    }, [sessionId]);

    const fetchPurchaseData = async () => {
        try {
            const response = await fetch('/api/verify-purchase?session_id=' + sessionId);
            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setPurchaseData(data);
            }
        } catch (err) {
            setError('Failed to verify purchase');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!purchaseData) return;

        setDownloading(true);

        try {
            const link = document.createElement('a');
            link.href = purchaseData.downloadUrl;
            link.download = purchaseData.artTitle + '.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => setDownloading(false), 2000);
        } catch (err) {
            alert('Download failed. Please try again.');
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-pink-400 mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Verifying your purchase...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="text-red-400 mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/" className="inline-block bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Payment Successful! 🎉
                    </h1>
                    <p className="text-gray-600">
                        Thank you for supporting my art!
                    </p>
                </div>

                {/* Download Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-1/3">
                                <img
                                    src={purchaseData?.artImage}
                                    alt={purchaseData?.artTitle}
                                    className="w-full rounded-2xl shadow-lg"
                                />
                            </div>
                            <div className="w-full md:w-2/3">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {purchaseData?.artTitle}
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Your purchase is complete! Download your high-resolution artwork below.
                                </p>

                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center space-x-2 mb-4"
                                >
                                    {downloading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Downloading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download size={20} />
                                            <span>Download Artwork</span>
                                        </>
                                    )}
                                </button>

                                <div className="bg-pink-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-700">
                                        <strong>💡 Important:</strong> Bookmark this page! You can return anytime to re-download your artwork. A download link has also been sent to <strong>{purchaseData?.customerEmail}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Confirmation Notice */}
                <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
                    <div className="flex items-start space-x-3">
                        <Mail className="text-pink-400 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">Check Your Email!</h3>
                            <p className="text-gray-600 text-sm">
                                We've sent a confirmation email to <strong>{purchaseData?.customerEmail}</strong> with your download link.
                                If you don't see it, please check your spam folder.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Usage Rights */}
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">📋 Usage Rights</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-green-700 mb-2">✅ You Can:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Print for personal use</li>
                                <li>Use as wallpaper</li>
                                <li>Share on social media</li>
                                <li>Gift to others (non-commercial)</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-red-700 mb-2">❌ You Cannot:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Resell or redistribute</li>
                                <li>Use commercially</li>
                                <li>Claim as your own work</li>
                                <li>Modify and resell</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg mb-6">
                    <h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                        If you have any issues with your download or questions about your purchase:
                    </p>
                    <a
                        href="mailto:shwetaparna111@gmail.com"
                        className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-semibold"
                    >
                        <Mail size={20} />
                        <span>shwetaparna111@gmail.com</span>
                    </a>
                </div>

                {/* Return Home */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
                    >
                        <ArrowLeft size={20} />
                        <span>Return to Gallery</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}