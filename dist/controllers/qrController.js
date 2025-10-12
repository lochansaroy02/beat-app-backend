var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../utils/prisma.js";
export const createQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lattitude, longitude, policeStation, dutyPoint } = req.body;
    const { userId } = req.query;
    try {
        if (!lattitude || !longitude || !policeStation) {
            return res.status(400).json({ message: 'lattitude,longitude and policeStation are required.' });
        }
        const isExisted = yield prisma.qR.findFirst({
            where: {
                lattitude, longitude
            }
        });
        if (isExisted) {
            res.status(501).json({ message: 'qr already generated' });
            return;
        }
        const qrData = yield prisma.qR.create({
            data: {
                lattitude,
                longitude,
                policeStation,
                dutyPoint
            }
        });
        res.status(201).json({
            message: "QR generated",
            data: qrData
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
const formatDate = (date) => {
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
export const scanQRcode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lattitude, longitude, pnoNo } = req.body;
    try {
        if (!lattitude || !longitude) {
            return res.status(400).json({ message: 'lattitude,longitude and policeStation are required.' });
        }
        const qrData = yield prisma.qR.findFirst({
            where: {
                lattitude, longitude,
            }
        });
        const scannedDate = new Date();
        const formattedDate = formatDate(scannedDate);
        yield prisma.qR.update({
            where: {
                id: qrData === null || qrData === void 0 ? void 0 : qrData.id
            },
            data: {
                isScanned: true,
                scannedBy: pnoNo,
                scannedOn: formattedDate
            }
        });
        res.status(200).json({
            message: "qr data updated"
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
export const getQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pnoNo } = req.params;
    try {
        if (!pnoNo) {
            return;
        }
        const qrData = yield prisma.qR.findMany({
            where: {
                scannedBy: pnoNo
            }
        });
        res.status(200).json({
            success: true,
            message: "qr data sent",
            data: qrData
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
export const getAllQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const qrData = yield prisma.qR.findMany();
        res.status(200).json({
            success: true,
            message: "qr data sent",
            data: qrData
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
const isValidQrData = (data) => {
    return data.lattitude && data.longitude && data.policeStation;
};
export const createBulkQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existedQRs = yield prisma.qR.findMany({
            where: {
                OR: coordinates
            },
            select: { lattitude: true, longitude: true }
        });
        const existedMap = new Set(existedQRs.map(qr => `${qr.lattitude},${qr.longitude}`));
        const newDataToCreate = validData.filter(d => !existedMap.has(`${d.lattitude},${d.longitude}`));
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
        const result = yield prisma.qR.createMany({
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
    }
    catch (error) {
        console.error("Bulk QR creation error:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
export const deleteQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { qrId } = req.params;
        yield prisma.qR.delete({
            where: {
                id: qrId
            }
        });
        res.status(201).json({
            message: "QR deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
//# sourceMappingURL=qrController.js.map