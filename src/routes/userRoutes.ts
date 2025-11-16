import express from "express";
import { getBankDetails, getFamily, getNominee, getUserById } from "../controllers/userController.js";

const router = express.Router();



router.get("/get-user/:id", getUserById)
router.get("/get-family/:id", getFamily)
router.get("/get-nominee/:id", getNominee)
router.get("/get-bank/:id", getBankDetails)





export default router