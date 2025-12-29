import { Request, Response } from "express";
import prisma from "../utils/prisma.js";


export const addPhoto = async (req: Request, res: Response) => {
    try {
        const { photos, userId, qrId } = req.body; // Added qrId

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
            qRId: qrId || null, // Link to the QR record if provided
            clickedOn: p.clickedOn ? String(p.clickedOn) : new Date().toISOString()
        }));

        // 3. Execute Transaction
        const result = await prisma.$transaction(async (tx) => {
            const savedResult = await tx.photos.createMany({
                data: photoData,
                skipDuplicates: true,
            });

            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { totalCount: { increment: 1 } }
            });

            return { savedResult, updatedUser };
        });

        res.status(201).json({
            success: true,
            message: "Submission successful. Attendance count increased.",
            photosSaved: photoData.length,
            currentTotalCount: result.updatedUser.totalCount
        });

    } catch (error: any) {
        console.error("Transaction Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getPhotoByID = async (req: Request, res: Response) => {
    try {


        const { userId, qrId } = req.body; // Added qrId

        // 1. Validation
        if (!qrId || !userId) {
            return res.status(400).json({
                success: false,
                message: "No qrId and userId found",
            });
        }


        const photos = await prisma.photos.findMany({
            where: {
                userId: userId,
                qRId: qrId

            }
        })

        res.status(201).json({
            success: true,
            message: "Photos are fetched",
            photos: photos
        });

    } catch (error: any) {
        console.error("Transaction Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


