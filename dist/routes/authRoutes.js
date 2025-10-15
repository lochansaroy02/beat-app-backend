import express from "express";
import { changePassword, login, signUp } from "../controllers/authController.js";
const router = express.Router();
router.post("/signup/:adminId", signUp);
router.post("/login", login);
router.post("/change-password", changePassword);
export default router;
//# sourceMappingURL=authRoutes.js.map