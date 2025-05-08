// src/lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { HoroscopeResult, DatabaseResult } from '../types';

// Configure neon client
neonConfig.fetchConnectionCache = true;

// Create a SQL query executor using the DATABASE_URL from environment
// Only initialize on the server side
const sql = typeof window === 'undefined'
    ? neon(process.env.DATABASE_URL!)
    : null;

// Initialize the database table
const initializeDatabase = async (): Promise<void> => {
    if (!sql) return;

    try {
        await sql`
      CREATE TABLE IF NOT EXISTS horoscopes (
        id SERIAL PRIMARY KEY,
        firstName TEXT NOT NULL,
        birthday TEXT NOT NULL,
        photoUrl TEXT,
        occupation TEXT NOT NULL,
        zodiacSign TEXT NOT NULL,
        horoscope TEXT NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        saved BOOLEAN DEFAULT FALSE
      );
    `;
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Initialize the database on server startup
if (sql) {
    initializeDatabase().catch(console.error);
}

export const saveHoroscope = async (result: HoroscopeResult): Promise<number> => {
    if (!sql) return -1;
debugger;
    try {
        const now = new Date().toISOString();
        const [newRecord] = await sql`
      INSERT INTO horoscopes (
        firstName, 
        birthday, 
        photoUrl, 
        occupation, 
        zodiacSign, 
        horoscope, 
        createdAt
      )
      VALUES (
        ${result.firstName},
        ${result.birthday},
        ${result.photoUrl},
        ${result.occupation},
        ${result.zodiacSign},
        ${result.horoscope},
        ${now}
      )
      RETURNING id
    `;

        return newRecord.id;
    } catch (error) {
        console.error('Error saving horoscope:', error);
        return -1;
    }
};

export const likeHoroscope = async (id: number): Promise<boolean> => {
    if (!sql) return false;

    try {
        const result = await sql`
      UPDATE horoscopes 
      SET saved = TRUE 
      WHERE id = ${id}
    `;

        return result.count > 0;
    } catch (error) {
        console.error('Error liking horoscope:', error);
        return false;
    }
};

export const getAllHoroscopes = async (): Promise<DatabaseResult[]> => {
    if (!sql) return [];

    try {
        const horoscopes = await sql`
      SELECT * 
      FROM horoscopes 
      WHERE saved = TRUE 
      ORDER BY createdAt DESC
    `;

        return horoscopes.map(h=>convertResult(h)) as DatabaseResult[];
    } catch (error) {
        console.error('Error getting all horoscopes:', error);
        return [];
    }
};

export const getHoroscopeById = async (id: number): Promise<DatabaseResult | null> => {
    if (!sql) return null;

    try {
        const [horoscope] = await sql`
      SELECT * 
      FROM horoscopes 
      WHERE id = ${id}
    `;

        return convertResult(horoscope) as DatabaseResult || null;
    } catch (error) {
        console.error('Error getting horoscope by id:', error);
        return null;
    }
};

export const convertResult = (horoscopelower: any) =>{
    return {
        ...horoscopelower,
        firstName: horoscopelower.firstname,
        photoUrl: horoscopelower.photourl,
        zodiacSign: horoscopelower.zodiacsign,
        createdAt: horoscopelower.createdat,
    }
}
