import { Suspense } from 'react';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Separate client component for search params
function SuccessContent() {
    // We'll handle this differently - no need for useSearchParams
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Payment Successful! 🎉
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase! Check your email for the download link to your artwork.
                </p>
                <div className="bg-pink-50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-pink-600 mb-2">
                        <Download size={20} />
                        <span className="font-semibold">Email Sent!</span>
                    </div>
                    <p className="text-sm text-gray-600">
                        Your download link will arrive within 2-3 minutes. Don&apos;t forget to check your spam folder!
                    </p>
                </div>
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
                    >
                        Back to Gallery
                    </Link>
                    <p className="text-xs text-gray-500">
                        Need help? Contact us at support@yourdomain.com
                    </p>
                </div>
            </div>
        </div>
    );
}

// Main component with Suspense wrapper
export default function SuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="animate-spin text-pink-400 mx-auto mb-4" size={48} />
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}