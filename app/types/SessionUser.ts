export type SessionUser = {
    id: string
    name: string
    image: string
    email: string
    posts: {
        id: string
        title: string
        content: string
        createdAt: string
        genre: string
        updatedAt?: string
        user: {
            id: string
            name: string
            email: string
            image: string
        }
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
            postId: string
            userId: string
            content: string
            user: {
                id: string
                name: string
                email: string
                image: string
            }
        }[]
    }[]
    likes: {
        id: string
        postId: string
    }[]
    following: {
        id: string
        followingId: string
        followerId: string
    }[]
}