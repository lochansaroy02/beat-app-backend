// index.ts

import cors from "cors";
import express, { Request, Response } from 'express';

// Import your route files (assuming they are in the same directory structure)
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import photosRoutes from './routes/photosRoutes.js';
import qrRoutes from './routes/qrRoutes.js';

const app = express();
app.use(express.json());

const FRONTEND_URL = 'https://dutytrack.vercel.app';

app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all standard methods, including OPTIONS
    // IMPORTANT: Include ALL headers your frontend sends (e.g., 'Authorization' for tokens)
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If you are using cookies or session-based authentication
}));

app.options('*', (req, res) => {
    res.sendStatus(204);
});


// --- 3. Routes ---
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);
app.use("/photo", photosRoutes);

// Health check route for the root path
app.get("/", async (req: Request, res: Response) => {
    res.json({
        message: "hello from Vercel Serverless Function!"
    })
});


if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const port = process.env.PORT || 8080;

    app.listen(port, () => {
        console.log(`Server running LOCALLY on port ${port}`);
    });
}

// THIS IS THE CRUCIAL PART FOR VERCEL
export default app;