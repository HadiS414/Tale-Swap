import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "DELETE") {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ message: "Please sign in to delete this comment" })
        }

        try {
            const commentId = req.query.id as string;
            const result = await prisma.comment.delete({
                where: {
                    id: commentId
                }
            });
            return res.status(200).json(result)
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while deleting the comment" })
        }
    }
}