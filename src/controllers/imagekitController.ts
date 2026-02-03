// imagekitController.ts
import dotenv from "dotenv";
import { Request, Response } from "express";
import ImageKit from "imagekit";

dotenv.config();

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || "";
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";

// Initialize inside a function or ensure it's not empty to prevent initialization errors
export const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
});

export const imageKitAuth = async (req: Request, res: Response) => {
    try {
        // Validate config presence before attempting auth
        if (!publicKey || !privateKey) {
            console.error("❌ IMAGEKIT ERROR: Keys missing in .env");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const authParams = imagekit.getAuthenticationParameters();

        return res.json({
            token: authParams.token,
            expire: authParams.expire,
            signature: authParams.signature,
            publicKey: publicKey,
        });
    } catch (error) {
        console.error("ImageKit Auth Error:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};