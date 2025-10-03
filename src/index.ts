import cors, { CorsOptions } from "cors";
import express, { Request, Response } from 'express';

// Import your route files (assuming they are in the same directory structure)
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import photosRoutes from './routes/photosRoutes.js';
import qrRoutes from './routes/qrRoutes.js';

const app = express();
app.use(express.json());

// 1. Define all allowed origins, including local and production URLs.
const allowedOrigins = [
    'http://localhost:3000',          // Local development environment
    'https://dutytrack.vercel.app'    // Production Vercel frontend
];

// 2. Configure CORS options using a custom function for origin checking.
const corsOptions: CorsOptions = {
    // The origin function checks if the incoming request origin is in the allowed list.
    origin: (origin, callback) => {
        // If the request has no origin (like Postman or curl, or same-origin), allow it.
        // Also allow if the origin is explicitly in our whitelist.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the request
        } else {
            // Block the request and log the unauthorized origin for debugging.
            console.error(`CORS Policy Error: Blocked request from unauthorized origin: ${origin}`);
            callback(new Error('Not allowed by CORS policy. The origin is restricted.'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // Ensure all necessary headers (like Authorization for tokens) are allowed.
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Crucial if your frontend sends cookies or tokens via 'withCredentials'
};

// Apply the robust CORS middleware configuration
app.use(cors(corsOptions));

// Handle the OPTIONS preflight requests explicitly (though 'cors' middleware usually handles this)
app.options('*', (req, res) => {
    // This sends a successful status 204 (No Content) response to the preflight
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


// --- 4. Server Start (Local Development Only) ---
// This part is ignored when deployed to Vercel, which manages its own server environment.
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const port = process.env.PORT || 8080;

    app.listen(port, () => {
        console.log(`Server running LOCALLY on port ${port}`);
    });
}

// THIS IS THE CRUCIAL PART FOR VERCEL
export default app;
