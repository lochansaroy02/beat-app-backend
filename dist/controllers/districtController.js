var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
export const createDistrict = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            res.status(411).json({
                message: "please enter the fields"
            });
        }
        const userExist = yield (prisma === null || prisma === void 0 ? void 0 : prisma.district.findUnique({
            where: {
                email
            }
        }));
        if (userExist) {
            res.status(403).json({
                error: "User already exist please login"
            });
            return;
        }
        const hashedPassword = yield bcrypt.hash(password, 12);
        const user = yield (prisma === null || prisma === void 0 ? void 0 : prisma.district.create({
            data: {
                name: name,
                email,
                passwordHash: hashedPassword
            }
        }));
        res.status(201).json({
            message: "User created successfully",
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server error",
            error: error
        });
    }
});
export const fetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (prisma === null || prisma === void 0 ? void 0 : prisma.district.findMany());
        res.status(201).json({ message: 'Data fetched', data: data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal server error', error: error });
    }
});
//# sourceMappingURL=districtController.js.map