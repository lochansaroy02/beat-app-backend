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
    const { lattitude, longitude, policeStation } = req.body;
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
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};
export const scanQRcode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lattitude, longitude, policeStation, pnoNo } = req.body;
    try {
        if (!lattitude || !longitude || !policeStation) {
            return res.status(400).json({ message: 'lattitude,longitude and policeStation are required.' });
        }
        const qrData = yield prisma.qR.findFirst({
            where: {
                lattitude, longitude
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
//# sourceMappingURL=qrController.js.map