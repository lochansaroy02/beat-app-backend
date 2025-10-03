import express from "express";
import { createQR, getQR, scanQRcode } from "../controllers/qrController.js";
const router = express.Router();
router.get("/get/:userId", getQR);
router.post("/create", createQR);
router.put("/scan", scanQRcode);
export default router;
//# sourceMappingURL=qrRoutes.js.map