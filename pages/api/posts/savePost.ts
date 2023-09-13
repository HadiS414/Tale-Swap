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
            return res.status(401).json({ message: "Please sign in to save a post" })
        }

        const postId: string = req.body.postId;
        const currentSessionUser = await prisma.user.findUnique({
            where: { email: session?.user?.email || undefined }
        });

        const isPostSaved = await prisma.savedPost.findFirst({
            where: {
                userId: currentSessionUser?.id,
                postId: postId
            }
        })

        try {
            if (!isPostSaved && currentSessionUser) {
                const savedPost = await prisma.savedPost.create({
                    data: {
                        userId: currentSessionUser.id,
                        postId: postId
                    }
                })

                const result = await prisma.user.update({
                    where: {
                        id: currentSessionUser?.id
                    },
                    data: {
                        savedPosts: {
                            connect: {
                                id: savedPost.id
                            }
                        }
                    }
                })
                return res.status(200).json(result);
            }
            else {
                const savedPost = await prisma.savedPost.delete({
                    where: {
                        id: isPostSaved?.id
                    }
                })

                const result = await prisma.user.update({
                    where: {
                        id: currentSessionUser?.id
                    },
                    data: {
                        savedPosts: {
                            disconnect: {
                                id: isPostSaved?.id
                            }
                        }
                    }
                })
                return res.status(200).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while saving post" })
        }
    }
}