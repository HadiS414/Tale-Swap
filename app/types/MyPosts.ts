export type MyPostsType = {
    id: string
    email: string
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