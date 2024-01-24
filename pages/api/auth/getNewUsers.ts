import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const newUsers = await prisma.user.findMany({
                orderBy : {
                    emailVerified: "desc"
                },
                include: {
                    posts: {
                        orderBy: {
                            createdAt: "desc"
                        }
                    },
                }
            });
            return res.status(200).json(newUsers)
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while fetching session user" })
        }
    }
}