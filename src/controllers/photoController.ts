import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

export const addPhoto = async (req: Request, res: Response) => {
    try {
        const { photos, userId } = req.body;

        // 1. Validation
        if (!photos || !userId || !Array.isArray(photos)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payload: 'photos' must be an array and 'userId' is required.",
            });
        }

        // 2. Prepare data for Prisma
        const photoData = photos.map(p => ({
            url: p.url,
            userId: userId,
            // Convert the frontend ISO string to a Date object
            clickedOn: p.clickedOn ? String(p.clickedOn) : new Date().toISOString()
        }));

        // 3. Execute Transaction
        const result = await prisma.$transaction(async (tx) => {
            // Save all photos in the array (1 or many)
            const savedResult = await tx.photos.createMany({
                data: photoData,
                skipDuplicates: true,
            });

            // ✅ INCREMENT BY 1 ONLY (Regardless of photo count)
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    totalCount: {
                        increment: 1
                    }
                }
            });

            return { savedResult, updatedUser };
        });

        // 4. Success Response
        res.status(201).json({
            success: true,
            message: "Submission successful. Attendance count increased by 1.",
            photosSaved: photoData.length,
            currentTotalCount: result.updatedUser.totalCount
        });

    } catch (error: any) {
        console.error("Transaction Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};