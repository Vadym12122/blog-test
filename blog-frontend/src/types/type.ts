export interface CommentFormProps {
    postId: number;
    onCommentAdded: () => void;
}

export interface Comment {
    id: number;
    author: string;
    text: string;
}

export interface CommentListProps {
    postId: number;
    comments: Comment[];
    onCommentsChange?: () => void;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    comments?: Comment[];
}
