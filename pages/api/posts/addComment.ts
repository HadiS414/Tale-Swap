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
        const vader = require("vader-sentiment");
        const { content, postId } = req.body.data;
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ message: "Please sign in to add a comment" })
        }
      
        if (!content.length) {
            return res.status(400).json({ message: "Please do not leave this empty" })
        }

        const commentScore = vader.SentimentIntensityAnalyzer.polarity_scores(content).compound;
        if (commentScore < -0.35) {
            return res.status(403).json({ message: "This comment is inappropriate" })
        }
        
        const currentSessionUser = await prisma.user.findUnique({
            where: { email: session?.user?.email || undefined }
        });
        
        try {
            const result = await prisma.comment.create({
                data: {
                    content: content,
                    userId: currentSessionUser?.id,
                    postId: postId,
                } as Prisma.CommentUncheckedCreateInput
            })
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while adding a comment" })
        }
    }
}