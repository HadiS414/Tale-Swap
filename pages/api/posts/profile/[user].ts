import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const userId = req.query.user as string;

        try {
            const data = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    posts: {
                        orderBy: {
                            createdAt: "desc"
                        },
                        include: {
                            user: true,
                            comments: {
                                include: {
                                    user: true
                                }
                            },
                            likes: true,
                        }
                    },
                    following: true,
                    followers: true
                }
            });
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while fetching posts" })
        }
    }
}