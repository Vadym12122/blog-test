import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Post } from "@/types/type";

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            title,
            content,
        }: {
            id: number;
            title: string;
            content: string;
        }) => {
            const { data } = await api.patch<Post>(`/posts/${id}`, {
                title,
                content,
            });
            return data;
        },
        onSuccess: (updatedPost) => {
            queryClient.setQueryData<Post[]>(["posts"], (old = []) => {
                const filtered = old.filter((p) => p.id !== updatedPost.id);
                return [updatedPost, ...filtered];
            });
        },
    });
};
