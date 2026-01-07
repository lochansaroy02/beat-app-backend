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
    const { adminId } = req.params;

    console.log("Searching for users with adminId:", adminId);

    try {
        // Test: Count all users regardless of adminId to verify DB connection
        const totalCount = await prisma.user.count();

        const users = await prisma.user.findMany({
            where: {
                adminId: adminId, // Ensure this matches your schema field name
            },
        });


        return res.status(200).json({
            success: true,
            totalInDb: totalCount,
            countFound: users.length,
            data: users
        });

    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({ message: 'Internal Server Error', error });
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






export const createUsers = async (req: Request, res: Response) => {
    const { adminId } = req.params;
    let usersData = req.body;
    // Frontend sends [user] or [user1, user2...]
    // If it's a single object, wrap it in an array so the rest of the code works
    if (usersData && typeof usersData === 'object' && !Array.isArray(usersData)) {
        usersData = [usersData];
    }

    try {
        // 1. Validation
        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }

        if (!Array.isArray(usersData) || usersData.length === 0) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array of users.' });
        }

        const createdUsers = [];
        const errors = [];

        // 2. Process each user in the array
        for (const user of usersData) {
            const { name, pnoNo, password, co, policeStation } = user;

            try {
                // Basic check for required fields per user
                if (!name || !pnoNo || !password) {
                    errors.push({ pnoNo: pnoNo || "Unknown", message: "Missing required fields" });
                    continue;
                }

                // Check for duplicate PNo No
                const existing = await prisma.user.findUnique({ where: { pnoNo } });
                if (existing) {
                    errors.push({ pnoNo, message: "User already exists" });
                    continue;
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user
                const newUser = await prisma.user.create({
                    data: {
                        name,
                        pnoNo,
                        password: hashedPassword,
                        co,
                        policeStation,
                        adminId: adminId
                        // If you have a relation to the admin who created them:
                        // creator: { connect: { id: adminId } } 
                    }
                });

                createdUsers.push(newUser);
            } catch (err: any) {
                errors.push({ pnoNo: user.pnoNo, message: err.message });
            }
        }

        // 3. Construct the Response based on results

        // Scenario A: Everything failed
        if (createdUsers.length === 0) {
            return res.status(400).json({
                message: "No users were created",
                errors: errors
            });
        }

        // Scenario B: Partial Success (Important for your frontend's 207 check)
        if (errors.length > 0) {
            return res.status(207).json({
                message: "Bulk creation partially successful",
                data: createdUsers,
                errors: errors
            });
        }

        // Scenario C: Total Success
        return res.status(201).json({
            message: usersData.length > 1 ? "All users created successfully" : "User created successfully",
            data: createdUsers
        });

    } catch (error: any) {
        console.error("Controller Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
