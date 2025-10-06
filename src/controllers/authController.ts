import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import prisma from '../utils/prisma.js';

export const signUp = async (req: Request, res: Response) => {
    try {
        const { adminId } = req.params;
        const { pnoNo, password, name } = req.body

        const isExisted = await prisma.user.findUnique({
            where: {
                pnoNo
            }
        })

        if (isExisted) {
            res.status(501).json({ message: 'user already found' })
            return
        }


        if (adminId == null || adminId == undefined) {
            res.status(500).json({ message: 'Internal Server Error' })
            return
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const userData = await prisma.user.create({
            data: {
                pnoNo,
                password: passwordHash,
                name,
                //@ts-ignore
                adminId,
                role: "user"
            }
        })

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userData
        })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
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