var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma.js';
export const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isExixting = yield prisma.admin.findFirst({
            where: {
                email
            }
        });
        if (isExixting) {
            return res.status(501).json({
                success: false,
                error: "Distict is already created "
            });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const districtData = yield prisma.admin.create({
            data: {
                name, email, password: hashedPassword
            }
        });
        return res.status(201).json({
            success: true,
            message: "district created successfully",
            data: districtData
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});
//# sourceMappingURL=adminController.js.map