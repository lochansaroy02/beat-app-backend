import express from "express";
import { createBulkQR, createQR, deleteQR, getAllQR, getQR, getQRId, scanQRcode } from "../controllers/qrController.js";

const router = express.Router();



router.get("/get/:id", getQR)
router.get("/get-all", getAllQR)
router.get("/findQR", getQRId);
router.post("/create", createQR)
router.put("/scan", scanQRcode)
router.post("/create/bulk", createBulkQR)
router.delete("/delete/:qrId", deleteQR)




export default router