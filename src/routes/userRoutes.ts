import express from "express";
import { fixData, getData, getPersonData, resetPassword } from "../controllers/userController.js";


const router = express.Router();



router.get("/get/:id", getData)
router.get("/get-person-data/:pnoNo", getPersonData)
router.put("/fix/:ps", fixData)
router.put("/reset-password", resetPassword)





export default router