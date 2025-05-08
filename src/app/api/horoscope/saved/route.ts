// src/app/api/horoscope/saved/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllHoroscopes, getHoroscopeById } from '@/lib/db.sqllite';

export async function GET(request: NextRequest) {
    try {
        // Get all saved horoscopes
        const horoscopes = getAllHoroscopes();

        return NextResponse.json({ horoscopes });
    } catch (error) {
        console.error('Error fetching saved horoscopes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch saved horoscopes' },
            { status: 500 }
        );
    }
}

// API route to get a specific horoscope by ID
export async function generateStaticParams() {
    const horoscopes = getAllHoroscopes();

    return horoscopes.map((horoscope) => ({
        id: horoscope.id.toString(),
    }));
}
