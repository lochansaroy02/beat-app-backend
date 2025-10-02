var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cors from "cors";
import express from 'express';
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
// --- Routes ---
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/qr", qrRoutes);
app.use("/photo", photosRoutes);
// Health check route for the root path
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        message: "hello from Vercel Serverless Function!"
    });
}));
// --- Conditional Local Server Startup ---
// VERCEL ONLY CARES ABOUT THE EXPORT, IT DOES NOT NEED app.listen()
// This check ensures 'app.listen' only runs when the file is executed directly 
// (e.g., via 'npm start' or 'npm run dev'), not when Vercel imports it.
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Server running LOCALLY on port ${port}`);
    });
}
// THIS IS THE CRUCIAL PART FOR VERCEL
// It exports the Express application object so Vercel can wrap it as a serverless function.
export default app;
//# sourceMappingURL=index.js.map