import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import photosRoutes from "./routes/photosRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import subAdminRoutes from "./routes/subAdminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

// ✅ Allowed Origins
const allowedOrigins = [
    "https://dutytrack.policetech.in",
    "http://localhost:3000",
    "http://dutytrack.in",
    "https://dutytrack.in",
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
app.use("/qr", qrRoutes);
app.use("/photo", photosRoutes);
app.use("/subAdmin", subAdminRoutes);
app.use("/user", userRoutes);


// Health check
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello from Vercel Serverless Function!" });
});

// Local dev only
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const port = process.env.PORT || 8080;
    app.listen(8080, "0.0.0.0", () => {
        console.log("Server running on 8080");
    });
}

export default app;
