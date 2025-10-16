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
import jwt from "jsonwebtoken";
import prisma from '../utils/prisma.js';
export const createSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, mobileNo, password } = req.body;
        const isExisting = yield prisma.subAdmin.findFirst({
            where: {
                mobileNo
            }
        });
        if (isExisting) {
            return res.status(501).json({
                success: false,
                error: "User is already created "
            });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const subAdminData = yield prisma.subAdmin.create({
            data: {
                name,
                mobileNo,
                role,
                password: hashedPassword
            }
        });
        return res.status(201).json({
            success: true,
            message: "subAdmin created",
            data: subAdminData
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
export const subAdminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNo, password } = req.body;
    try {
        if (!mobileNo || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = yield prisma.subAdmin.findFirst({
            where: {
                mobileNo
            }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatched = yield bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({ message: 'Invalid Password' });
        }
        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.mobileNo,
            role: user.role
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({
            success: true,
            tokenPayload,
            message: "Login successful",
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
export const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId } = req.params;
    try {
        const users = yield prisma.user.findMany({
            where: {
                adminId,
            },
            select: {
                name: true,
                pnoNo: true,
                id: true,
                photos: {
                    select: {
                        url: true, userId: true
                    },
                }
            }
        });
        return res.status(201).json({
            success: true,
            message: "user Data",
            data: users
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
//# sourceMappingURL=subAdminController.js.map