"use client";

import { useState } from "react";
import { Post } from "@/types/type";

interface PostFormProps {
    initialData?: Post;
    onSubmit: (payload: { title: string; content: string }) => void;
    submitLabel?: string;
    submitting?: boolean;
}

export default function PostForm({
    initialData,
    onSubmit,
    submitLabel = "Зберегти",
    submitting = false,
}: PostFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [content, setContent] = useState(initialData?.content ?? "");

    const handle = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, content });
    };

    return (
        <form onSubmit={handle} className="flex flex-col gap-4 max-w-2xl">
            <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded"
                required
            />
            <textarea
                placeholder="Контент"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border p-2 rounded h-36"
                required
            />
            <button
                type="submit"
                disabled={submitting}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
            >
                {submitting ? "Зберігаю..." : submitLabel}
            </button>
        </form>
    );
}
