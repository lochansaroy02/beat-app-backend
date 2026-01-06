import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from '../utils/prisma.js';




export const createSubAdmin = async (req: Request, res: Response) => {
    try {
        const { name, role, mobileNo, password } = req.body
        const isExisting = await prisma.subAdmin.findFirst({
            where: {
                mobileNo
            }
        })
        if (isExisting) {
            return res.status(501).json({
                success: false,
                error: "User is already created "
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const subAdminData = await prisma.subAdmin.create({
            data: {
                name,
                mobileNo,
                role,
                password: hashedPassword
            }
        })
        return res.status(201).json({
            success: true,
            message: "subAdmin created",
            data: subAdminData
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }



}


export const subAdminLogin = async (req: Request, res: Response) => {
    const { mobileNo, password } = req.body
    try {
        if (!mobileNo || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await prisma.subAdmin.findFirst({
            where: {
                mobileNo
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
            name: user.name,
            email: user.mobileNo,
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

export const getUsers = async (req: Request, res: Response) => {

    const { adminId } = req.params
    try {

        const users = await prisma.user.findMany({
            where: {
                adminId,
            },
            select: {
                name: true,
                pnoNo: true,

                id: true,
                photo: {
                    select: {
                        url: true,
                        clickedOn: true
                    },
                }
            }
        })
        return res.status(201).json({
            success: true,
            message: "user Data",
            data: users
        });


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}






