import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
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
            message: "admin data",
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


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await prisma.admin.findFirst({
            where: {
                email
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
            email: user.email

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
                photos: {
                    select: {
                        url: true,
                        userId: true,
                        clickedOn: true,
                        createdAt: true,
                    },
                }
            }
        })
        console.log(users);
        return res.status(201).json({
            success: true,
            message: "user Data",
            data: users
        });


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    const { pnoNo } = req.params
    try {
        if (!pnoNo) {
            res.status(500).json({ message: 'No user selected' })
            return
        }
        const data = await prisma.user.delete({
            where: {
                pnoNo: pnoNo
            }
        })
        return res.status(200).json({
            message: "User deleted successfully"
        })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}