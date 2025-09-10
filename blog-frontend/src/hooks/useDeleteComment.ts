"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Post } from "@/types/type";

export const useDeleteComment = (postId: number) => {
    const queryClient = useQueryClient();

    return useMutation<
        number,
        Error,
        number,
        {
            previousNum?: Post;
            previousStr?: Post;
        }
    >({
        mutationFn: async (commentId: number) => {
            await api.delete(`/comments/${commentId}`);
            return commentId;
        },

        onMutate: async (commentId) => {
            const keyNum = ["post", postId] as const;
            const keyStr = ["post", String(postId)] as const;

            await Promise.all([
                queryClient.cancelQueries({ queryKey: keyNum }),
                queryClient.cancelQueries({ queryKey: keyStr }),
            ]);

            const previousNum = queryClient.getQueryData<Post>(keyNum);
            const previousStr = queryClient.getQueryData<Post>(keyStr);

            if (previousNum) {
                queryClient.setQueryData<Post>(keyNum, {
                    ...previousNum,
                    comments: (previousNum.comments ?? []).filter(
                        (c) => c.id !== commentId
                    ),
                });
            }
            if (previousStr) {
                queryClient.setQueryData<Post>(keyStr, {
                    ...previousStr,
                    comments: (previousStr.comments ?? []).filter(
                        (c) => c.id !== commentId
                    ),
                });
            }

            return { previousNum, previousStr };
        },

        onError: (_err, _commentId, ctx) => {
            const keyNum = ["post", postId] as const;
            const keyStr = ["post", String(postId)] as const;

            if (ctx?.previousNum)
                queryClient.setQueryData<Post>(keyNum, ctx.previousNum);
            if (ctx?.previousStr)
                queryClient.setQueryData<Post>(keyStr, ctx.previousStr);
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["post", postId] }),
                queryClient.invalidateQueries({
                    queryKey: ["post", String(postId)],
                }),
            ]);
        },
    });
};
