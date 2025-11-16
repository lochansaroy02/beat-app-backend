import express from "express";
import { changePassword, login } from "../controllers/authController.js";
import { createUser } from "../controllers/userController.js";

const router = express.Router();



router.post("/signup/:adminId", createUser)
router.post("/login", login)
router.post("/change-password", changePassword)




export default router