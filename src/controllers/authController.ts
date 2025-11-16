import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import prisma from '../utils/prisma.js';


interface UserInput {
    name: string;
    pnoNo: string;
    co: string;
    policeStation: string
    password: string;
}



export const signUp = async (req: Request, res: Response) => {
    try {
        const { adminId } = req.params;
        const inputData: UserInput | UserInput[] = req.body;

        // --- Input Validation: Check for adminId ---
        if (!adminId) {
            return res.status(500).json({ message: 'Internal Server Error: Admin ID missing' });
        }

        const adminExists = await prisma.admin.findUnique({
            where: {
                id: adminId,
            }
        });

        if (!adminExists) {
            // Return 404 or 400 with a clear message if the admin ID is invalid
            return res.status(404).json({
                message: `Validation Error: Admin with ID ${adminId} not found. Foreign key constraint would be violated.`,
            });
        }
        // --- Helper function for single user creation ---
        const createUser = async (user: UserInput) => {
            const { pnoNo, password, name, co, policeStation } = user;

            // 1. Check for existing user
            const isExisted = await prisma.user.findUnique({
                where: { pnoNo }
            });

            if (isExisted) {
                // Return a specific object indicating failure for bulk operation
                return { success: false, pnoNo, message: 'User already exists' };
            }

            // 2. Hash password and create user
            const passwordHash = await bcrypt.hash(password, 10);
            const userData = await prisma.user.create({
                data: {
                    pnoNo,
                    password: passwordHash,
                    name,
                    co,
                    policeStation,
                    adminId: adminId as string,
                    role: "user"
                }
            });

            return { success: true, pnoNo, data: userData };
        };

        // --- Handle Bulk Signup (Array Input) ---
        if (Array.isArray(inputData)) {
            const results = await Promise.all(inputData.map(createUser));

            const successfulCreations = results.filter(r => r.success);
            const failedCreations = results.filter(r => !r.success);

            return res.status(207).json({ // 207 Multi-Status is appropriate for partial success/failure
                success: true,
                message: `${successfulCreations.length} user(s) created successfully. ${failedCreations.length} failed.`,
                data: successfulCreations.map(r => r.data),
                errors: failedCreations.map(r => ({ pnoNo: r.pnoNo, message: r.message }))
            });
        }

        // --- Handle Single Signup (Object Input) ---
        const result = await createUser(inputData);

        if (!result.success) {
            return res.status(501).json({ message: result.message });
        }

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result.data
        });

    } catch (error) {
        // Log the error for debugging purposes in a real application
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export const login = async (req: Request, res: Response) => {
    const { pnoNo, password } = req.body
    try {

        if (!pnoNo || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await prisma.user.findFirst({
            where: {
                pnoNo
            }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            return res.status(401).json({ message: 'Invalid Password' });

        }
        const tokenPayload = {
            id: user.id,
            pnoNo: user.pnoNo,
            name: user.name,
            role: user.role

        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );
        return res.status(201).json({
            success: true,
            tokenPayload,
            message: "Login successful",
            token,

        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }

}
// NOTE: Assuming you have 'prisma', 'Request', and 'Response' types available

export const changePassword = async (req: Request, res: Response) => {

    const { pnoNo, oldPassword, newPassword } = req.body;

    try {
        // --- 1. Basic Validation ---
        if (!pnoNo || !oldPassword || !newPassword) {
            return res.status(400).json({ message: 'PnoNo, old password, and new password are required.' });
        }

        const user = await prisma.user.findFirst({
            where: {
                pnoNo
            }
        });

        if (!user) {
            // Use a specific status/message if the user is not found
            return res.status(404).json({ message: 'User not found.' });
        }

        // --- 2. Verify Old Password ---
        const isMatched = await bcrypt.compare(oldPassword, user.password);

        if (!isMatched) {
            return res.status(401).json({ message: 'Incorrect old password.' });
        }

        // --- 3. Hash the New Password ---
        // Define your salt rounds (e.g., 10 or 12)
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // --- 4. Update the User Record ---
        const updatedUser = await prisma.user.update({
            where: { pnoNo: pnoNo }, // Ensure pnoNo is a unique identifier for update
            data: { password: hashedPassword },
            select: { pnoNo: true } // Select only non-sensitive data to return
        });

        // --- 5. Return Success Response ---
        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
            user: { pnoNo: updatedUser.pnoNo }
        });

    } catch (error) {
        // Log the error for server-side debugging
        console.error("Change Password Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};