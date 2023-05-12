export type MyPostType = {
    email: string
    id: string
    image: string
    name: string
    posts: {
        createdAt: string
        id: string
        content: string
        title: string
        comments?: {
            createdAt: string
            id: string
            content: string
            postId: string
            userId:string
        }[]
    }[]
}