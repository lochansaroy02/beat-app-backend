import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

export const addPhoto = async (req: Request, res: Response) => {
    try {
        const { photoUrl, userId } = req.body;

        if (!photoUrl || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: photoUrl or userId",
            });
        }

        const photoUrlsArray: string[] = Array.isArray(photoUrl) ? photoUrl : [photoUrl];
        const photoData = photoUrlsArray.map(url => ({
            url: url,
            userId: userId,
        }));

        // Use a Transaction to ensure both operations succeed or fail together
        const result = await prisma.$transaction(async (tx) => {
            // 1. Save the photo(s)
            let savedPhotos;
            if (photoData.length === 1) {
                savedPhotos = await tx.photos.create({
                    data: photoData[0],
                });
            } else {
                savedPhotos = await tx.photos.createMany({
                    data: photoData,
                    skipDuplicates: true,
                });
            }


            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    totalCount: {
                        increment: 1
                    }
                }
            });

            return { savedPhotos, updatedUser };
        });

        res.status(201).json({
            success: true,
            message: "Attendance marked and photo saved successfully.",
            data: result.savedPhotos,
            currentCount: result.updatedUser.totalCount
        });

    } catch (error: any) {
        console.error("Error in photo upload transaction:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process attendance.",
            error: error.message
        });
    }
};