import cors from "cors";
import express, { Request, Response } from 'express';


import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import photosRoutes from './routes/photosRoutes.js';
import qrRoutes from './routes/qrRoutes.js';

const app = express();
app.use(express.json());


const corsOptions = {
    origin: 'https://dutytrack.vercel.app/en',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));


// --- Routes ---
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
