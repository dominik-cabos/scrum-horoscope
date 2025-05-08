// src/components/HoroscopeList.tsx
'use client';

import { useState } from 'react';
import { DatabaseResult } from '@/types';

interface HoroscopeListProps {
    horoscopes: DatabaseResult[];
}

export default function HoroscopeList({ horoscopes }: HoroscopeListProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Function to get the first two paragraphs of the horoscope
    const getPreviewText = (horoscope: string) => {
        const paragraphs = horoscope.split('\n\n');
        const preview = paragraphs.slice(0, 2).join('\n\n');

        return {
            preview,
            hasMore: paragraphs.length > 2
        };
    };

    return (
        <div className="space-y-6">
            {horoscopes.map((horoscope) => {
                const { preview, hasMore } = getPreviewText(horoscope.horoscope);

                return (
                    <div key={horoscope.id} className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Thumbnail and Info */}
                            <div className="md:w-1/4 flex-shrink-0">
                                <img
                                    src={horoscope.photoUrl}
                                    alt={`${horoscope.firstName}'s photo`}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{horoscope.firstName}</h3>
                                    <p className="text-gray-600 text-sm">{horoscope.occupation}</p>
                                    <p className="text-purple-600 text-sm">{horoscope.zodiacSign}</p>
                                    <p className="text-gray-500 text-xs mt-2">Saved on {formatDate(horoscope.createdAt)}</p>
                                </div>
                            </div>

                            {/* Horoscope Content */}
                            <div className="md:w-3/4">
                                <div className="prose prose-sm">
                                    {expandedId === horoscope.id ? (
                                        // Show full horoscope
                                        horoscope.horoscope.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="mb-2">
                                                {paragraph}
                                            </p>
                                        ))
                                    ) : (
                                        // Show preview
                                        preview.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="mb-2">
                                                {paragraph}
                                            </p>
                                        ))
                                    )}

                                    {hasMore && (
                                        <button
                                            onClick={() => toggleExpand(horoscope.id)}
                                            className="text-purple-600 hover:text-purple-800 mt-2 text-sm font-medium"
                                        >
                                            {expandedId === horoscope.id ? 'Show Less' : 'Read More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
