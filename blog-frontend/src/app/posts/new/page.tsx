"use client";

import { useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";
import { useCreatePost } from "@/hooks/useCreatePost";

export default function NewPostPage() {
    const router = useRouter();
    const mutation = useCreatePost();
    const submitting = mutation.status === "pending";

    const handleCreate = (payload: { title: string; content: string }) => {
        mutation.mutate(payload, {
            onSuccess: () => {
                router.push("/posts");
            },
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Створити пост</h1>
            <PostForm
                onSubmit={handleCreate}
                submitting={submitting}
                submitLabel="Створити"
            />
            {mutation.status === "error" && (
                <p className="text-red-500 mt-3">Помилка створення</p>
            )}
        </div>
    );
}
