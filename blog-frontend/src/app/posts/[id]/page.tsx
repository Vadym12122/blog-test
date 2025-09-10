"use client";

import { useParams } from "next/navigation";
import { useGetPost } from "@/hooks/useGetPost";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";
import { useQueryClient } from "@tanstack/react-query";

export default function ViewPostPage() {
    const { id: rawId } = useParams();
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { data: post, isLoading, isError } = useGetPost(id);
    const queryClient = useQueryClient();

    if (isLoading) return <p>Завантаження...</p>;
    if (!post || isError) return <p>Пост не знайдено</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="my-2">{post.content}</p>

            <CommentList postId={post.id} comments={post.comments ?? []} />

            <CommentForm
                postId={post.id}
                onCommentAdded={() =>
                    queryClient.invalidateQueries({
                        queryKey: ["post", post.id],
                    })
                }
            />
        </div>
    );
}
