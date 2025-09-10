"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Post } from "@/types/type";

export default function EditPostPage() {
    const router = useRouter();
    const { id: rawId } = useParams();
    const queryClient = useQueryClient();

    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return <p>Невірний id поста</p>;

    const { data: post, isPending } = useQuery<Post>({
        queryKey: ["post", id] as const,
        queryFn: async () => {
            const { data } = await api.get(`/posts/${id}`);
            return data;
        },
    });

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [post]);

    const mutation = useMutation<
        Post,
        Error,
        { title: string; content: string }
    >({
        mutationFn: async (updatedPost) => {
            const { data } = await api.patch(`/posts/${id}`, updatedPost);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            router.push(`/posts/${id}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ title, content });
    };

    if (isPending) return <p>Завантаження...</p>;
    if (!post) return <p>Пост не знайдено</p>;

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Редагувати пост</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="text"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <textarea
                    placeholder="Текст поста"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 rounded h-32"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Оновлення..." : "Оновити"}
                </button>
                {mutation.isError && (
                    <p className="text-red-500">Помилка редагування поста</p>
                )}
            </form>
        </div>
    );
}
