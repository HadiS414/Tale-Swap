import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";
import { Prisma } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ message: "Please sign in to like a post" })
        }

        const postId = req.body.postId;
        const currentSessionUser = await prisma.user.findUnique({
            where: { email: session?.user?.email || undefined }
        });

        const like = await prisma.like.findFirst({
            where: {
                postId: postId,
                userId: currentSessionUser?.id
            } 
        })

        try {
            if (!like) {
                const result = await prisma.like.create({
                    data: {
                        postId: postId,
                        userId: currentSessionUser?.id
                    } as Prisma.LikeUncheckedCreateInput
                });
                return res.status(200).json(result);
            }
            else {
                const result = await prisma.like.delete({
                    where: {
                        id: like.id
                    }
                });
                return res.status(200).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while liking post" })
        }
    }
}



