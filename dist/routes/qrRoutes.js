import express from "express";
import { createBulkQR, createQR, getAllQR, getQR, scanQRcode } from "../controllers/qrController.js";
const router = express.Router();
router.get("/get/:pnoNo", getQR);
router.get("/get-all", getAllQR);
router.post("/create", createQR);
router.put("/scan", scanQRcode);
router.post("/create/bulk", createBulkQR);
export default router;
//# sourceMappingURL=qrRoutes.js.map