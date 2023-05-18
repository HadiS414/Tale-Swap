import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ message: "Please sign in to fetch your posts" })
        }

        try {
            const data = await prisma.user.findUnique({
                where: {
                    email: session.user?.email || undefined
                },
                include: {
                    posts: {
                        orderBy: {
                            createdAt: "desc"
                        },
                        include: {
                            comments: {
                                include: {
                                    user: true
                                }
                            },
                            likes: true
                        }
                    },
                }
            });
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while fetching your posts" })
        }
    }
}