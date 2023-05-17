import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: "Please sign in to fetch posts" })
    }

    const currentSessionUser = await prisma.user.findUnique({
        where: { 
            email: session?.user?.email || undefined 
        },
        include: {
            following: true
        }
    });

    let followingList: string[] = [];
    currentSessionUser?.following.map((following) => followingList.push(following.followingId))

    if (req.method === "GET") {
        try {
            const data = await prisma.post.findMany({
                where: {
                    userId: { in: followingList }
                },
                include: {
                    user: true,
                    comments: true,
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