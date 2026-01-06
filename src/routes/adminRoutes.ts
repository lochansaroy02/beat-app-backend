import express from "express";
import { createAdmin, createUsers, getUsers, login } from "../controllers/adminController.js";
import { updatePoliceStaion, updateUser } from "../controllers/userController.js";

const router = express.Router();



router.post("/create", createAdmin)
router.post("/create-users/:adminId", createUsers)
router.post("/login", login)
router.get("/get-users/:adminId", getUsers)
router.put("/update-user/:id", updateUser)
router.put("/update-policeStation/:id", updatePoliceStaion)




export default router