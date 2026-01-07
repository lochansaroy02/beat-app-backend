import express from "express";
import { fixData, getData, getPersonData } from "../controllers/userController.js";


const router = express.Router();



router.get("/get/:id", getData)
router.get("/get-person-data/:pnoNo", getPersonData)
router.get("/fix/:policeStation", fixData)




export default router