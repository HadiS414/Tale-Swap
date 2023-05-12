export type PostType = {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt?: string
    user: {
        id: string
        name: string
        email: string
        image: string
    }
    comments: {
        createdAt: string
        id: string
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
}