export type SessionUser = {
    id: string
    name: string
    image: string
    email: string
    posts: {
        id: string
        content: string
        createdAt: string
        genre: string
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