import { Request, Response } from "express";

export const createQR = async (req: Request, res: Response) => {
    const { lattitude, longitude, policeStation } = req.body
    const { userId } = req.query
    try {

        if (!lattitude || !longitude || !policeStation) {
            return res.status(400).json({ message: 'lattitude,longitude and policeStation are required.' });
        }
        const isExisted = await prisma?.qR.findFirst({
            where: {
                lattitude, longitude
            }
        })
        if (isExisted) {
            res.status(501).json({ message: 'qr already generated' })
            return
        }

        const qrData = await prisma?.qR.create({
            data: {
                lattitude,
                longitude,
                policeStation,
            }

        })

        res.status(201).json({
            message: "QR generated",
            data: qrData
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }

}



const formatDate = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};



export const scanQRcode = async (req: Request, res: Response) => {
    const { lattitude, longitude, policeStation, pnoNo } = req.body

    try {

        if (!lattitude || !longitude || !policeStation) {
            return res.status(400).json({ message: 'lattitude,longitude and policeStation are required.' });
        }

        const qrData = await prisma?.qR.findFirst({
            where: {
                lattitude, longitude
            }
        })
        const scannedDate = new Date();
        const formattedDate = formatDate(scannedDate);
        await prisma?.qR.update({
            where: {
                id: qrData?.id
            },
            data: {
                isScanned: true,
                scannedBy: pnoNo,
                scannedOn: formattedDate
            }
        })
        res.status(200).json({
            message: "qr data updated"
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }

}

