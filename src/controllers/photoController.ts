import { Request, Response } from "express";
import prisma from "../utils/prisma.js";
interface PhotoBody {
    // This field can be a single URL string or an array of URL strings
    photoUrl: string | string[];
    // Assuming you link the photos to a specific QR code data or user ID
    qrId: string;
}
export const addPhoto = async (req: Request<{}, {}, any>, res: Response) => {
    try {
        // 1. Change destructuring to match your Frontend payload (photos instead of photoUrl)
        const { photos, userId } = req.body;

        // 2. Update the validation logic
        if (!photos || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: photos or userId",
            });
        }

        // 3. Normalize: Ensure photos is an array even if a single object is sent
        const photosArray = Array.isArray(photos) ? photos : [photos];

        // 4. Prepare data for Prisma
        const photoData = photosArray.map((item: any) => ({
            url: item.url,
            clickedOn: item.clickedOn, // This captures the date sent from the app
            userId: userId,
        }));

        let results;

        if (photoData.length === 1) {
            // Use `create` for a single entry
            results = await prisma.photos.create({
                data: photoData[0],
            });
        } else {
            // Use `createMany` for bulk uploads
            results = await prisma.photos.createMany({
                data: photoData,
                skipDuplicates: true,
            });
        }

        res.status(201).json({
            success: true,
            message: `${photoData.length} photo(s) saved successfully.`,
            data: results,
        });

    } catch (error: any) {
        console.error("Error saving photo(s):", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error during photo save.",
            error: error.message
        });
    }
};