import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Post } from "@/types/type";

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { title: string; content: string }) => {
            const { data } = await api.post<Post>("/posts", payload);
            return data;
        },
        onSuccess: (newPost) => {
            queryClient.setQueryData<Post[]>(["posts"], (old = []) => [
                newPost,
                ...old,
            ]);
        },
    });
};
