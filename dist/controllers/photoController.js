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
        const photoData = photosArray.map((item) => ({
            url: item.url,
            clickedOn: item.clickedOn, // This captures the date sent from the app
            userId: userId,
        }));
        let results;
        if (photoData.length === 1) {
            // Use `create` for a single entry
            results = yield prisma.photos.create({
                data: photoData[0],
            });
        }
        else {
            // Use `createMany` for bulk uploads
            results = yield prisma.photos.createMany({
                data: photoData,
                skipDuplicates: true,
            });
        }
        res.status(201).json({
            success: true,
            message: `${photoData.length} photo(s) saved successfully.`,
            data: results,
        });
    }
    catch (error) {
        console.error("Error saving photo(s):", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error during photo save.",
            error: error.message
        });
    }
});
//# sourceMappingURL=photoController.js.map