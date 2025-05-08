// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled error:', error);
    }, [error]);

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                <p className="text-gray-700 mb-6">
                    We encountered an error while processing your request. Please try again or go back to the home page.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
