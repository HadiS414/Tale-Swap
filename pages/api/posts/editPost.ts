import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PATCH") {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ message: "Please sign in to edit a post" })
        }

        const content: string = req.body.content;
        const postId = req.body.postId;

        if (!content.length) {
            return res.status(400).json({ message: "Please do not leave this empty" })
        }

        try {
            const result = await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    content: content
                }
            })
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while editing post" })
        }
    }
}