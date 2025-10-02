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
    const data = req.body;
    try {
        if (Array.isArray(data)) {
            const users = data;
            if (users.length === 0) {
                return res.json({ success: false, error: "The user array cannot be empty." });
            }
            for (const user of users) {
                if (!user.name || !user.email || !user.password) {
                    return res.status(400).json({ success: false, error: `A user object is missing required fields (name, email, password).` });
                }
            }
            const emails = users.map(user => user.email);
            const existingUsers = yield prisma.user.findMany({
                where: { email: { in: emails } },
                select: { email: true }
            });
            if (existingUsers.length > 0) {
                const existingEmails = existingUsers.map(user => user.email);
                return res.status(409).json({ success: false, error: `Users with these emails already exist: ${existingEmails.join(", ")}` });
            }
            const usersToCreate = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                const passwordHash = yield bcrypt.hash(user.password, 10);
                return Object.assign(Object.assign({}, user), { passwordHash, password: undefined });
            })));
            // Step 4: Create all users in a single database transaction
            const result = yield prisma.user.createMany({
                data: usersToCreate,
                skipDuplicates: true, // As an extra safeguard
            });
            return res.status(201).json({ success: true, message: `${result.count} users created successfully.` });
        }
        else {
            // Original logic for creating a single user
            const { name, email, password, districtId, mobileNo, policeStation, rank, role } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, error: "Name, email, and password are required" });
            }
            const existing = yield prisma.user.findUnique({ where: { email } });
            if (existing) {
                return res.status(409).json({ success: false, error: "A user with this email already exists" });
            }
            const passwordHash = yield bcrypt.hash(password, 10);
            const newUser = yield prisma.user.create({
                data: {
                    name,
                    email,
                    mobileNo,
                    policeStation,
                    rank,
                    role,
                    passwordHash,
                    districtId
                },
            });
            return res.status(201).json({ success: true, data: newUser });
        }
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
//# sourceMappingURL=userController.js.map