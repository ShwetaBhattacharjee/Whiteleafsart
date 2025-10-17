'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            router.push('/download?session_id=' + sessionId);
        }
    }, [sessionId, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin text-pink-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">Redirecting to your download...</p>
            </div>
        </div>
    );
}