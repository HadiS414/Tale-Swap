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
            return res.status(401).json({ message: "Please sign in to follow/unfollow a user" })
        }

        const userToBeFollowedId = req.body.id;
        const currentSessionUser = await prisma.user.findUnique({
            where: { email: session?.user?.email || undefined }
        });

        if (currentSessionUser?.id === userToBeFollowedId) {
            return res.status(401).json({ message: "You cannot follow yourself" })
        }

        const isFollowing = await prisma.follows.findFirst({
            where: {
                followingId: userToBeFollowedId
            }
        })

        try {
            if (!isFollowing) {
                const result = await prisma.follows.create({
                    data: {
                        followerId: currentSessionUser?.id,
                        followingId: userToBeFollowedId
                    } as Prisma.FollowsUncheckedCreateInput
                });
                return res.status(200).json(result);
            }
            else {
                const result = await prisma.follows.delete({
                    where: {
                        id: isFollowing.id
                    } as Prisma.FollowsWhereUniqueInput
                });
                return res.status(200).json(result);
            }
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error: "Error while following/unfollowing user" })
        }
    }
}