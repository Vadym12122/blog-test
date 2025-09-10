"use client";

import Link from "next/link";

export default function HomePage() {
    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-3xl font-bold mb-6">Вітаю у блозі 🚀</h1>
            <p className="text-lg text-gray-600 mb-8">
                Переглядай пости або створи новий.
            </p>
            <Link
                href="/posts"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Перейти до постів
            </Link>
        </div>
    );
}
