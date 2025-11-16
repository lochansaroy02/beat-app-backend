import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

type FamilyMemberInput = {
    name: string;
    aadhaar: string;
    relation: string;
    dob: string;
    isNominee: boolean,
    age: number;
    dependecy: string;
};

export const createUser = async (req: Request, res: Response) => {

    try {
        const { adminId } = req.params;
        const { familyMembers,

            employeeId,
            name,
            pranNo,
            hrmsId,
            father,
            dob,
            designation,
            division,
            postingLocation,
            gradePay,
            group,
            railwayZone,
            dateOfIssueLater,
            contact,
            address,
            nationality,
            maritalStatus,
            height,
            weight,
            religion,
            community,
            bloodGroup,

            bankAddress,
            bankName,
            ifsc,
            cif,
            accountNo,

            identification,
            madicalStatus,
            aadharNumber,
            password,
        } = req.body
        const passwordHash = await bcrypt.hash(password, 10);



        const isExisted = await prisma.user.findUnique({
            where: {
                employeeId: employeeId
            }
        })
        if (isExisted) {
            res.status(500).json({ message: 'user already exists' })
        }
        const newUser = await prisma.user.create({
            //@ts-ignore
            data: {
                employeeId,
                name,
                pranNo,
                hrmsId,
                father,
                dob,
                designation,
                division,
                postingLocation,
                gradePay,
                group,
                railwayZone,
                dateOfIssueLater,

                contact,
                address,
                nationality,
                maritalStatus,
                height,
                weight,
                religion,
                community,
                bloodGroup,
                identification,
                madicalStatus,
                aadharNumber,
                password: passwordHash,
                adminId: adminId,
                familyMembers: familyMembers && familyMembers.length > 0 ? {
                    create: familyMembers.map((member: any) => ({
                        ...member,
                        age: parseInt(String(member.age), 10)
                    }))
                } : undefined,
                // bank details
                bankAddress, bankName, ifsc, cif, accountNo

            },
            include: {
                familyMembers: true,
                photos: false,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });

    } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(400).json({ message: 'A user with this unique identifier already exists.' });
            }
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * 👤 Retrieves a single User by ID.
 * GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            data: user,
            photoUrl: user.photoUrl
        });
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getFamily = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.familyMember.findMany({
            where: {
                userId: id
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getNominee = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.familyMember.findMany({
            where: {
                userId: id,
                isNominee: true
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBankDetails = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const bankDetails = await prisma.user.findFirst({
            where: {
                id: id,
            },
            select: {
                bankAddress: true,
                bankName: true,
                ifsc: true,
                cif: true,
                accountNo: true
            }
        });

        if (!bankDetails) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            data: bankDetails
        });
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * ✍️ Updates an existing User's information (Scalar Fields Only).
 * PUT /api/users/:id
 */
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateData = req.body as Prisma.UserUpdateInput;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
            }
        });

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'User not found for update.' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * 🗑️ Deletes a User.
 * DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedUser = await prisma.user.delete({
            where: { id },
            select: { id: true, name: true }
        });

        return res.status(200).json({
            success: true,
            message: `User with ID ${deletedUser.id} deleted successfully.`
        });
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: 'User not found for deletion.' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};