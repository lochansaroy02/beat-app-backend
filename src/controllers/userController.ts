import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';



interface UserInput {
    name: string;
    pnoNo: string;
    co: string;
    policeStation: string
    password: string;
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { pnoNo, co, policeStation, name } = req.body;

        // --- Input Validation: Ch eck for adminId ---
        if (!id) {
            return res.status(500).json({ message: 'Internal Server Error: Admin ID missing' });
        }




        const user = await prisma.user.update({
            data: {
                pnoNo: pnoNo,
                name: name,
                co: co,
                policeStation: policeStation
            },
            where: {
                id: id
            }
        })
        return res.status(201).json({ message: 'user Updated' })



    } catch (error) {
        // Log the error for debugging purposes in a real application
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}