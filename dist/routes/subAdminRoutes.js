import express from "express";
import { createSubAdmin, subAdminLogin } from "../controllers/subAdminController.js";
const router = express.Router();
router.post("/create", createSubAdmin);
router.post("/login", subAdminLogin);
export default router;
//# sourceMappingURL=subAdminRoutes.js.map