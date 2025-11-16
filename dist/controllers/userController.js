var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from '../utils/prisma.js';
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { pnoNo, co, policeStation, name } = req.body;
        // --- Input Validation: Ch eck for adminId ---
        if (!id) {
            return res.status(500).json({ message: 'Internal Server Error: Admin ID missing' });
        }
        const user = yield prisma.user.update({
            data: {
                pnoNo: pnoNo,
                name: name,
                co: co,
                policeStation: policeStation
            },
            where: {
                id: id
            }
        });
        return res.status(201).json({ message: 'user Updated' });
    }
    catch (error) {
        // Log the error for debugging purposes in a real application
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
//# sourceMappingURL=userController.js.map