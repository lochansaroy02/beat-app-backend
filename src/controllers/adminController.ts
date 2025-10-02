import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import prisma from '../utils/prisma.js';



export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        const isExixting = await prisma.admin.findFirst({
            where: {
                email
            }
        })
        if (isExixting) {
            return res.status(501).json({
                success: false,
                error: "Distict is already created "
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const districtData = await prisma.admin.create({
            data: {
                name, email, password: hashedPassword
            }
        })
        return res.status(201).json({
            success: true,
            message: "district created successfully",
            data: districtData
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

}