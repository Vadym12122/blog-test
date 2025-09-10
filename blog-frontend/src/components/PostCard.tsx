"use client";

import Link from "next/link";
import { Post } from "@/types/type";
import { useDeletePost } from "@/hooks/useDeletePost";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const mutation = useDeletePost();
    const isPending = mutation.status === "pending";

    const handleDelete = () => {
        if (confirm(`Видалити пост "${post.title}"?`)) {
            mutation.mutate(post.id);
        }
    };

    return (
        <div className="border p-4 my-2 rounded flex justify-between items-start">
            <div>
                <h2 className="font-semibold">{post.title}</h2>
                <p className="mt-2">{post.content}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Link
                    href={`/posts/${post.id}`}
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 text-center"
                >
                    Переглянути
                </Link>

                <Link
                    href={`/posts/${post.id}/edit`}
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 text-center"
                >
                    Редагувати
                </Link>

                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    disabled={isPending}
                >
                    {isPending ? "Видалення..." : "Видалити"}
                </button>
            </div>
        </div>
    );
}
