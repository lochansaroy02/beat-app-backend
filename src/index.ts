import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import photosRoutes from "./routes/photosRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

// ✅ Allowed Origins
const allowedOrigins = [
    "https://dutytrack.policetech.in",
    "http://localhost:3000"
];

// ✅ CORS Options
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS blocked: ${origin}`);
            callback(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS globally (fixes path-to-regexp error)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Allow preflight for all routes

// --- Routes ---
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/photo", photosRoutes);
app.use("/user", userRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello from Vercel Serverless Function!" });
});

// Local dev only
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`🚀 Server running locally on port ${port}`);
    });
}

export default app;
