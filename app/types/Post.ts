export type PostType = {
    title: string
    content: string
    id: string
    createdAt: string
    user: {
        name: string
        image: string
    }
    comments?: {
        createdAt: string
        id: string
        postId: string
        userId: string
        content: string
    }[]
}