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



        res.status(201).json({
            success: true,
            message: "Submission successful. Attendance count increased.",
            photosSaved: photoData.length,
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


        const photos = await prisma.photo.findMany({
            where: {


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






// Matching the types you provided
interface photoProps {
    url: string;
    clickedOn: string;
}

interface SubmitRequestBody {
    qrId: string;       // The ID of the QR record being scanned
    userId: string;     // The ID of the user scanning
    scannedOn: string;  // ISO String
    photo: photoProps;
}




export const submitQR = async (req: Request, res: Response) => {
    try {
        const { qrId, userId, scannedOn, photo } = req.body;

        // 1. Fetch the 'Template' details of the QR being scanned
        const templateQR = await prisma.qR.findUnique({
            where: { id: qrId }
        });

        if (!templateQR) {
            return res.status(404).json({ message: "QR Code not found" });
        }

        const result = await prisma.$transaction(async (tx) => {

            // 2. Create a new Photo record
            const newPhoto = await tx.photo.create({
                data: {
                    url: photo.url,
                    clickedOn: photo.clickedOn,
                }
            });

            // 3. Create a NEW QR record (representing this specific scan instance)
            // This ensures the scan array in the User model grows
            const newScanEntry = await tx.qR.create({
                data: {
                    // Copy location data from the template
                    lattitude: templateQR.lattitude,
                    longitude: templateQR.longitude,
                    policeStation: templateQR.policeStation,
                    catagory: templateQR.catagory,
                    dutyPoint: templateQR.dutyPoint,

                    // Add the new scan-specific data
                    scannedOn: scannedOn,
                    scannedBy: userId,
                    userId: userId,    // This links it to the User's qrCode array
                    photoId: newPhoto.id
                }
            });

            // 4. Increment the totalCount for the User
            await tx.user.update({
                where: { id: userId },
                data: {
                    totalCount: { increment: 1 }
                }
            });

            return newScanEntry;
        });

        return res.status(201).json({
            success: true,
            message: "New scan entry created",
            data: result
        });

    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};