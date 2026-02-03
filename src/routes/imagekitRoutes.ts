import express from "express";
import { imageKitAuth } from "../controllers/imagekitController.js";

const router = express.Router();



router.get("/auth", imageKitAuth)





export default router