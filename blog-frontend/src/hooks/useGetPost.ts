"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Post } from "@/types/type";

export const useGetPost = (id: number | string | undefined) => {
    const postId = id ? Number(id) : NaN;
    return useQuery({
        queryKey: ["post", postId],
        queryFn: async (): Promise<Post> => {
            const { data } = await api.get<Post>(`/posts/${postId}`);
            return data;
        },
        enabled: !Number.isNaN(postId),
    });
};
