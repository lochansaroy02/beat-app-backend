import express from "express";
import { createAdmin } from "../controllers/adminController.js";
const router = express.Router();
router.post("/create", createAdmin);
export default router;
//# sourceMappingURL=adminRoutes.js.map