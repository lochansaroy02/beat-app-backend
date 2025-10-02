import express from "express";
import { createQR, scanQRcode } from "../controllers/qrController.js";

const router = express.Router();



router.post("/create", createQR)
router.put("/scan", scanQRcode)



export default router