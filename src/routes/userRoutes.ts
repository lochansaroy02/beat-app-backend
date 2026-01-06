import express from "express";
import { getData, getPersonData } from "../controllers/userController.js";


const router = express.Router();



router.get("/get/:id", getData)
router.get("/get-person-data/:pnoNo", getPersonData)




export default router