"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { CommentFormProps } from "@/types/type";

export default function CommentForm({
    postId,
    onCommentAdded,
}: CommentFormProps) {
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!author.trim() || !text.trim()) {
            setError("Будь ласка, заповніть поля Автор та Коментар.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await api.post("/comments", {
                author: author.trim(),
                text: text.trim(),
                postId,
            });

            setAuthor("");
            setText("");

            onCommentAdded();
        } catch (err) {
            setError(
                "Сталася помилка при додаванні коментаря. Спробуйте пізніше."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
            <h2 className="mt-8 mb-5 text-center text-xl font-semibold">
                Додати коментар
            </h2>

            <input
                type="text"
                placeholder="Автор"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border p-2 rounded"
            />

            <textarea
                placeholder="Коментар"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border p-2 rounded"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
            >
                {loading ? "Відправка..." : "Додати коментар"}
            </button>
        </form>
    );
}
