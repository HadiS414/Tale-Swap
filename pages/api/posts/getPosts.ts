import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const data = await prisma.post.findMany({
                include: {
                    user: true,
                    comments: {
                        include: {
                            user: true
                        }
                    },
                    likes: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while fetching posts" })
        }
    }
}