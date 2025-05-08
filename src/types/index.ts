// src/types/index.ts

export type Occupation =
    | "Frontend Developer (Angular)"
    | "Frontend Developer (React)"
    | "Backend Developer (Node.js)"
    | "Business Analyst"
    | "Quality Assurance Engineer"
    | "Designer"
    | "Product Owner"
    | "Delivery Lead";

export interface HoroscopeRequest {
    firstName: string;
    birthday: string; // Format: MM/DD
    photoUrl: string;
    occupation: Occupation;
}

export interface HoroscopeResult {
    id?: number;
    firstName: string;
    birthday: string;
    photoUrl: string;
    occupation: Occupation;
    zodiacSign: string;
    horoscope: string;
    createdAt?: string;
}

export interface DatabaseResult extends HoroscopeResult {
    id: number;
    createdAt: string;
}

export interface ApiResponse {
    result: string;
}
