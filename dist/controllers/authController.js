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
import jwt from "jsonwebtoken";
import prisma from '../utils/prisma.js';
export const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const { pnoNo, password, name } = req.body;
        const isExisted = yield prisma.user.findUnique({
            where: {
                pnoNo
            }
        });
        if (isExisted) {
            res.status(501).json({ message: 'user already found' });
            return;
        }
        if (adminId == null || adminId == undefined) {
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        const passwordHash = yield bcrypt.hash(password, 10);
        const userData = yield prisma.user.create({
            data: {
                pnoNo,
                password: passwordHash,
                name,
                //@ts-ignore
                adminId,
                role: "user"
            }
        });
        res.status(201).json({
            message: 'User created successfully',
            data: userData
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error });
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pnoNo, password } = req.body;
    try {
        if (!pnoNo || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = yield prisma.user.findFirst({
            where: {
                pnoNo
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
            pnoNo: user.pnoNo,
            name: user.name,
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
//# sourceMappingURL=authController.js.map