import express from "express";
import { createBulkQR, createQR, deleteQR, getAllQR, getQR, scanQRcode } from "../controllers/qrController.js";
const router = express.Router();
router.get("/get/:pnoNo", getQR);
router.get("/get-all", getAllQR);
router.post("/create", createQR);
router.put("/scan", scanQRcode);
router.post("/create/bulk", createBulkQR);
router.delete("/delete/:qrId", deleteQR);
export default router;
//# sourceMappingURL=qrRoutes.js.map