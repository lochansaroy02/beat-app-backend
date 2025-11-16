import express from "express";
import { createAdmin, getUsers, login } from "../controllers/adminController.js";

const router = express.Router();



router.post("/create", createAdmin)
router.post("/login", login)
router.get("/get-users/:adminId", getUsers)
router.get("/detele-user/:pnoNo", getUsers)



export default router