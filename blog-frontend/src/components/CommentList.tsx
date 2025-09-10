"use client";

import { useDeleteComment } from "@/hooks/useDeleteComment";
import { CommentListProps } from "@/types/type";

export default function CommentList({
    postId,
    comments,
    onCommentsChange,
}: CommentListProps) {
    const { mutate: deleteComment, isPending } = useDeleteComment(postId);

    const handleDelete = (id: number) => {
        if (confirm("Видалити цей коментар?")) {
            deleteComment(id, {
                onSuccess: () => {
                    onCommentsChange?.();
                },
            });
        }
    };

    return (
        <div className="mt-10">
            <h2 className="text-center">Коментарі</h2>

            {comments.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">
                    Поки що немає жодного коментаря
                </p>
            ) : (
                <ul className="mt-6 space-y-2">
                    {comments.map((c) => (
                        <li
                            key={c.id}
                            className="border p-2 rounded flex justify-between items-start"
                        >
                            <div>
                                <p className="font-semibold">{c.author}</p>
                                <p>{c.text}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(c.id)}
                                disabled={isPending}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                Видалити
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
