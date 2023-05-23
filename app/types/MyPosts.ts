export type MyPostsType = {
    id: string
    email: string
    image: string
    name: string
    posts: {
        createdAt: string
        id: string
        title: string
        content: string
        genre: string
        likes: {
            id: string
            postId: string
            userId: string
            user: {
                id: string
                name: string
                email: string
                image: string
            }
        }[]
        comments: {
            id: string
            createdAt: string
            content: string
            postId: string
            userId: string
            user: {
                id: string;
                name: string;
                email: string;
                image: string;
            };
        }[]
    }[]
}