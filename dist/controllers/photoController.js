var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const addPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { photoUrl, userId } = req.body;
        if (!photoUrl || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: photoUrl or qrId",
            });
        }
        // 1. Normalize the photoUrl into an array
        const photoUrlsArray = Array.isArray(photoUrl) ? photoUrl : [photoUrl];
        // 2. Prepare data for Prisma
        // We map the array of URLs into an array of objects for Prisma's createMany or create
        const photoData = photoUrlsArray.map(url => ({
            url: url,
            userId: userId,
        }));
        let results;
        if (photoData.length === 1) {
            // Option A: Use `create` for a single entry
            results = yield (prisma === null || prisma === void 0 ? void 0 : prisma.photos.create({
                data: photoData[0],
            }));
        }
        else {
            results = yield (prisma === null || prisma === void 0 ? void 0 : prisma.photos.createMany({
                data: photoData,
                skipDuplicates: true,
            }));
        }
        res.status(201).json({
            success: true,
            message: `${photoUrlsArray.length} photo(s) saved successfully.`,
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