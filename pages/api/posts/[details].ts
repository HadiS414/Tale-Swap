import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const postId = req.query.details as string;
        try {
            const data = await prisma.post.findUnique({
                where: {
                    id: postId
                },
                include: {
                    user: true,
                    comments: {
                        orderBy: {
                            createdAt: "desc"
                        },
                        include: {
                            user: true
                        }
                    },
                    likes: true
                }
            })
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while fetching your posts" })
        }
    }
}