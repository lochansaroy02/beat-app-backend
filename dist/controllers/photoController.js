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
export const addPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { photoUrl, userId } = req.body;
        if (!photoUrl || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: photoUrl or userId",
            });
        }
        const photoUrlsArray = Array.isArray(photoUrl) ? photoUrl : [photoUrl];
        const photoData = photoUrlsArray.map(url => ({
            url: url,
            userId: userId,
        }));
        // Use a Transaction to ensure both operations succeed or fail together
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Save the photo(s)
            let savedPhotos;
            if (photoData.length === 1) {
                savedPhotos = yield tx.photos.create({
                    data: photoData[0],
                });
            }
            else {
                savedPhotos = yield tx.photos.createMany({
                    data: photoData,
                    skipDuplicates: true,
                });
            }
            const updatedUser = yield tx.user.update({
                where: { id: userId },
                data: {
                    totalCount: {
                        increment: 1
                    }
                }
            });
            return { savedPhotos, updatedUser };
        }));
        res.status(201).json({
            success: true,
            message: "Attendance marked and photo saved successfully.",
            data: result.savedPhotos,
            currentCount: result.updatedUser.totalCount
        });
    }
    catch (error) {
        console.error("Error in photo upload transaction:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process attendance.",
            error: error.message
        });
    }
});
//# sourceMappingURL=photoController.js.map