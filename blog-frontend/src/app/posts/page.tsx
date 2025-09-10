"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Post } from "@/types/type";
import { useState, useEffect } from "react";

export default function PostsPage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const query = useQuery({
        queryKey: ["posts"],
        queryFn: async (): Promise<Post[]> => {
            const res = await api.get<Post[]>("/posts");
            return res.data;
        },
        initialData: [],
    });

    const posts = query.data?.slice().sort((a, b) => b.id - a.id) ?? [];

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            post.content.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const total = filteredPosts.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (query.isLoading) return <p>Завантаження...</p>;
    if (query.error)
        return (
            <p>
                Помилка:{" "}
                {query.error instanceof Error
                    ? query.error.message
                    : "Невідома помилка"}
            </p>
        );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Пости</h1>
                <Link
                    href="/posts/new"
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                    Створити новий пост
                </Link>
            </div>

            <input
                type="text"
                placeholder="Пошук по заголовку або контенту..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
                className="border p-2 rounded mb-4 w-full"
            />

            {filteredPosts.length === 0 ? (
                <p>Нічого не знайдено за запитом "{debouncedSearch}"</p>
            ) : (
                <>
                    <ul>
                        {paginatedPosts.map((post: Post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </ul>

                    <div className="mt-4 flex gap-2 justify-center items-center">
                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Попередня
                        </button>

                        <span className="px-3 py-1 border rounded">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            disabled={currentPage >= totalPages}
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Наступна
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
