// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'The Scrum Horoscope',
    description: 'Get your next sprint horoscope based on your IT occupation',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-purple-700 text-white p-4 shadow-md">
                <h1 className="text-2xl font-bold">The Scrum Horoscope</h1>
            </header>

            <div className="flex flex-grow">
                {/* Sidebar Navigation */}
                <nav className="w-64 bg-gray-100 p-4 shadow-md">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/"
                                className="block p-2 rounded hover:bg-purple-100 hover:text-purple-700 transition"
                            >
                                New Horoscope
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/saved"
                                className="block p-2 rounded hover:bg-purple-100 hover:text-purple-700 transition"
                            >
                                Saved Horoscopes
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="flex-grow p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
        </body>
        </html>
    );
}
