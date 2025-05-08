// src/app/saved/page.tsx
import { getAllHoroscopes } from '@/lib/db';
import HoroscopeList from '@/components/HoroscopeList';
import { DatabaseResult } from '@/types';

// This function enables Static Site Generation
export async function generateStaticParams() {
    const horoscopes = getAllHoroscopes();
    return horoscopes.map((horoscope) => ({
        id: horoscope.id.toString(),
    }));
}

// This function is required for SSG with occasional revalidation
export const revalidate = 0; // Revalidate on-demand

export default function SavedPage() {
    const horoscopes = getAllHoroscopes();

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Saved Horoscopes</h2>

            {horoscopes.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-gray-500">No saved horoscopes yet.</p>
                    <a href="/" className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        Create Your First Horoscope
                    </a>
                </div>
            ) : (
                <HoroscopeList horoscopes={horoscopes as DatabaseResult[]} />
            )}
        </div>
    );
}
