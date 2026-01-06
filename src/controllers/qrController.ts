import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

export const createQR = async (req: Request, res: Response) => {
    const { lattitude, longitude, policeStation, dutyPoint, cug, catagory } = req.body
    try {

        if (!lattitude || !longitude || !policeStation || !catagory) {
            res.status(400).json({
                message: 'lattitude,longitude and policeStation are required.'
            });
            return
        }

        const isExisted = await prisma.qR.findFirst({
            where: {
                lattitude,
                longitude
            }
        })
        if (isExisted) {
            res.status(501).json({ message: 'qr already generated' })
            return
        }

        const qrData = await prisma.qR.create({
            data: {
                lattitude,
                longitude,
                policeStation,
                dutyPoint,
                catagory,

            }

        })

        res.status(201).json({
            message: "QR generated",
            data: qrData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }

}




export const scanQRcode = async (req: Request, res: Response) => {
    const { latitude, longitude, pnoNo, dutyPoint, date, userId } = req.body;

    try {
        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "Latitude and longitude are required",
            });
        }

        // clean coordinates
        const cleanLat = String(latitude).trim().replace(/['"]/g, "");
        const cleanLon = String(longitude).trim().replace(/['"]/g, "");

        /**
         * 1️⃣ Find QR by coordinates
         */
        const qrData = await prisma.qR.findFirst({
            where: {
                lattitude: cleanLat,
                longitude: cleanLon,
            },
        });

        if (!qrData) {
            return res.status(404).json({
                message: "QR not found for this location",
            });
        }

        /**
         * 2️⃣ Prevent double scan
         */
        if (qrData.scannedBy) {
            return res.status(409).json({
                message: "QR already scanned",
                scannedBy: qrData.scannedBy,
                scannedOn: qrData.scannedOn,
            });
        }

        /**
         * 3️⃣ Update QR scan info
         */
        await prisma.qR.update({
            where: { id: qrData.id },
            data: {
                scannedBy: String(pnoNo),
                scannedOn: date,
                dutyPoint: dutyPoint,
                userId: userId,
            },
        });

        /**
         * 4️⃣ Increment user total scan count
         */
        await prisma.user.update({
            where: { id: userId },
            data: {
                totalCount: {
                    increment: 1,
                },
            },
        });

        return res.status(200).json({
            message: "QR scanned successfully",
            qrId: qrData.id,
        });
    } catch (error: any) {
        console.error("Scan QR Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const getQR = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        if (!id) {

            return res.status(400).json({
                success: false,
                message: "PNO number is required in the request parameters."
            });
        }

        const qrData = await prisma.qR.findMany({
            where: {
                userId: id

            },
            select: {
                lattitude: true,
                longitude: true,
                policeStation: true,
                scannedOn: true,
                dutyPoint: true,
                photo: {
                    select: {
                        url: true,
                        clickedOn: true,
                    }

                }
            }
        })

        res.status(200).json({
            success: true,
            message: "qr data sent",
            data: qrData
        })

    } catch (error) {
        console.error("PRISMA ERROR:", error); // Check your terminal/logs for this!
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
}
export const getAllQR = async (req: Request, res: Response) => {
    const { userId } = req.params
    try {
        const qrData = await prisma.qR.findMany()
        res.status(200).json({
            success: true,
            message: "qr data sent",
            data: qrData
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}




const isValidQrData = (data: any) => {
    return data.lattitude && data.longitude && data.policeStation;
};

export const createBulkQR = async (req: Request, res: Response) => {
    // Expecting an array of data under the key 'bulkData'
    const { bulkData } = req.body;

    if (!Array.isArray(bulkData) || bulkData.length === 0) {
        return res.status(400).json({ message: 'Bulk data must be a non-empty array.' });
    }

    // Filter out invalid entries and prepare data for creation
    const validData = bulkData.filter(isValidQrData);

    if (validData.length === 0) {
        return res.status(400).json({ message: 'No valid entries found in the provided bulk data.' });
    }

    try {
        // 1. Check for existing entries based on lattitude and longitude (optional but recommended)
        const coordinates = validData.map(d => ({ lattitude: d.lattitude, longitude: d.longitude }));
        const existedQRs = await prisma.qR.findMany({
            where: {
                OR: coordinates
            },
            select: { lattitude: true, longitude: true }
        });

        const existedMap = new Set(existedQRs.map(qr => `${qr.lattitude},${qr.longitude}`));

        const newDataToCreate = validData.filter(d =>
            !existedMap.has(`${d.lattitude},${d.longitude}`)
        );

        const existingCount = validData.length - newDataToCreate.length;

        if (newDataToCreate.length === 0) {
            return res.status(200).json({
                message: `All ${validData.length} entries already existed. No new QR codes generated.`,
                createdCount: 0,
                existingCount: existingCount
            });
        }


        // 2. Use prisma's createMany for efficient bulk insertion
        // Note: createMany does not return the created records' data by default
        const result = await prisma.qR.createMany({
            //fix this code
            //@ts-ignore
            data: newDataToCreate.map(d => ({
                lattitude: String(d.lattitude),
                longitude: String(d.longitude),
                policeStation: String(d.policeStation),
                dutyPoint: d.dutyPoint ? String(d.dutyPoint) : null // Ensure dutyPoint is handled
            })),
            skipDuplicates: true // Good practice to prevent database errors if a unique constraint exists
        });

        res.status(201).json({
            message: "Bulk QR codes processed successfully.",
            createdCount: result.count,
            existingCount: existingCount,
            totalProcessed: validData.length
        });

    } catch (error) {
        console.error("Bulk QR creation error:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}

export const deleteQR = async (req: Request, res: Response) => {
    try {
        const { qrId } = req.params
        await prisma.qR.delete({
            where: {
                id: qrId
            }
        })
        res.status(201).json({
            message: "QR deleted successfully"
        })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}



export const updateCUG = async (req: Request, res: Response) => {
    try {

        const { policeStation, cug } = req.body

        const data = await prisma.qR.updateMany({
            where: {
                policeStation: policeStation
            }, data: {
                cug: cug
            }
        })

        return res.status(201).json({
            message: "data upadted successfully",
            data: data
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}

export const getQRId = async (req: Request, res: Response) => {
    try {
        // 1. Use req.query for GET requests
        // Note: Destructuring as string to ensure compatibility with Prisma where needed
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Missing latitude or longitude parameters"
            });
        }

        // 2. Find the QR in the database
        // Use findFirst or findUnique depending on your schema constraints
        const qr = await prisma.qR.findFirst({
            where: {
                // Ensure these match your Prisma schema field names exactly
                lattitude: String(latitude),
                longitude: String(longitude)
            }
        });

        // 3. Handle 'Not Found' case
        if (!qr) {
            return res.status(404).json({
                success: false,
                message: "This location is not registered as a valid Duty Point."
            });
        }

        // 4. Return Success
        return res.status(200).json({
            success: true,
            message: "QR Verified Successfully",
            qrId: qr.id // This is the ID your frontend is expecting
        });

    } catch (error) {
        console.error("Error finding QR:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
};


