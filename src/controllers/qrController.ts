import { Request, Response } from "express";
import prisma from "../utils/prisma.js";

export const createQR = async (req: Request, res: Response) => {
    const { lattitude, longitude, policeStation, dutyPoint } = req.body

    try {

        if (!lattitude || !longitude || !policeStation) {
            return res.status(400).json({
                message: 'lattitude,longitude and policeStation are required.'
            });
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
                dutyPoint
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


const formatDate = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    let hh = date.getHours();
    const min = String(date.getMinutes()).padStart(2, "0");

    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12;
    hh = hh ? hh : 12; // convert 0 (midnight) to 12

    const hhStr = String(hh).padStart(2, "0");

    return `${dd}-${mm}-${yyyy} ${hhStr}:${min} ${ampm}`;
};



export const scanQRcode = async (req: Request, res: Response) => {
    const { lattitude, longitude, pnoNo, dutyPoint, date } = req.body

    try {

        if (!lattitude || !longitude) {
            return res.status(400).json({ message: 'lattitude,longitude and policeStation are required.' });
        }

        const qrData = await prisma.qR.findFirst({
            where: {
                lattitude, longitude,
            }
        })
        const scannedDate = new Date();
        const formattedDate = formatDate(scannedDate);
        await prisma.qR.update({
            where: {
                id: qrData?.id
            },
            data: {
                isScanned: true,
                scannedBy: pnoNo,
                dutyPoint: dutyPoint,
                scannedOn: date
            }
        })
        res.status(200).json({
            message: "qr data updated"
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }

}

export const getQR = async (req: Request, res: Response) => {
    const { pnoNo } = req.params
    try {
        if (!pnoNo) {
            return
        }
        const qrData = await prisma.qR.findMany({
            where: {
                scannedBy: pnoNo
            }
        })
        res.status(200).json({
            success: true,
            message: "qr data sent",
            data: qrData
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
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
