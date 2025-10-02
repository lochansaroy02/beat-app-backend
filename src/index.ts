import cors from "cors";
import express, { Request, Response } from 'express';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import photosRoutes from './routes/photosRoutes.js';
import qrRoutes from './routes/qrRoutes.js';
const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};


app.use(cors(corsOptions));

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);
app.use("/photo", photosRoutes);

app.get("/", async (req: Request, res: Response) => {
    res.json({
        message: "hello"
    })
})





if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(8080, () => {
        console.log('Server running on port 3000');
    });
}

// THIS IS CRUCIAL FOR VERCEL
export default app;
