// src/lib/db.ts
import { Database } from 'better-sqlite3';
import { HoroscopeResult, DatabaseResult } from '../types';

let dbSqllite: Database | null = null;

if (typeof window === 'undefined') {
    // Server-side only
    const sqlite = require('better-sqlite3');
    dbSqllite = new sqlite('./horoscope.db');

    // Initialize the database
    dbSqllite?.exec(`
    CREATE TABLE IF NOT EXISTS horoscopes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      birthday TEXT NOT NULL,
      photoUrl TEXT,
      occupation TEXT NOT NULL,
      zodiacSign TEXT NOT NULL,
      horoscope TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      saved BOOLEAN DEFAULT 0
    );
  `);
}

export const saveHoroscope = (result: HoroscopeResult): number => {
    if (!dbSqllite) return -1;

    const stmt = dbSqllite.prepare(`
    INSERT INTO horoscopes (firstName, birthday, photoUrl, occupation, zodiacSign, horoscope, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const now = new Date().toISOString();
    const info = stmt.run(
        result.firstName,
        result.birthday,
        result.photoUrl,
        result.occupation,
        result.zodiacSign,
        result.horoscope,
        now
    );

    return info.lastInsertRowid as number;
};

export const likeHoroscope = (id: number): boolean => {

    if (!dbSqllite) return false;

    const stmt = dbSqllite.prepare(`
    UPDATE horoscopes SET saved = 1 WHERE id = ?
  `);

    const info = stmt.run(id);
    return info.changes > 0;
}

export const getAllHoroscopes = (): DatabaseResult[] => {
    if (!dbSqllite) return [];

    const stmt = dbSqllite.prepare(`
  SELECT * FROM horoscopes WHERE saved = 1 ORDER BY createdAt DESC
`);
    return stmt.all() as DatabaseResult[];
};

export const getHoroscopeById = (id: number): DatabaseResult | null => {
    if (!dbSqllite) return null;

    const stmt = dbSqllite.prepare(`
    SELECT * FROM horoscopes WHERE id = ?
  `);

    return stmt.get(id) as DatabaseResult || null;
};
