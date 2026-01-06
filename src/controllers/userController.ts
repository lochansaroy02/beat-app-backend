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

export const updatePoliceStaion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { co, policeStation, } = req.body;

        // --- Input Validation: Ch eck for adminId ---
        if (!id) {
            return res.status(500).json({ message: 'Internal Server Error: Admin ID missing' });
        }


        const user = await prisma.user.update({
            data: {
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




export const getData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Validation: Ensure ID is provided
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }


        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                pnoNo: true,
                policeStation: true,
                qrCode: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        lattitude: true,
                        longitude: true,
                        policeStation: true,
                        catagory: true,
                        dutyPoint: true,
                        scannedOn: true,
                        scannedBy: true,
                        photo: {
                            select: {
                                clickedOn: true,
                                url: true,
                            },
                        },
                    },
                },
            },
        });

        // 3. Handle case where user doesn't exist
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 4. Format the response to match your exact 'userData' structure
        const userData = {
            id: user.id,
            name: user.name,
            pnoNo: user.pnoNo,
            policeStation: user.policeStation,
            scanData: user.qrCode // Renaming the key for the frontend
        };

        return res.status(200).json(userData);

    } catch (error) {
        console.error("Fetch User Error:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getPersonData = async (req: Request, res: Response) => {
    try {
        const { pnoNo } = req.params;

        // 1. Validation: Ensure ID is provided
        if (!pnoNo) {
            return res.status(400).json({ message: 'User ID is required' });
        }


        const user = await prisma.user.findUnique({
            where: { pnoNo },
            select: {
                id: true,
                name: true,
                pnoNo: true,
                policeStation: true,
                qrCode: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        lattitude: true,
                        longitude: true,
                        policeStation: true,
                        catagory: true,
                        dutyPoint: true,
                        scannedOn: true,
                        scannedBy: true,
                        photo: {
                            select: {
                                clickedOn: true,
                                url: true,
                            },
                        },
                    },
                },
            },
        });

        // 3. Handle case where user doesn't exist
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 4. Format the response to match your exact 'userData' structure
        const userData = {
            id: user.id,
            name: user.name,
            pnoNo: user.pnoNo,
            policeStation: user.policeStation,
            scanData: user.qrCode // Renaming the key for the frontend
        };

        return res.status(200).json(userData);

    } catch (error) {
        console.error("Fetch User Error:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
