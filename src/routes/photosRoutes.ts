import express from "express";
import { addPhoto, getPhotoByID, submitQR } from "../controllers/photoController.js";

const router = express.Router();



router.post("/create", addPhoto)
router.post("/get", getPhotoByID)
router.post("/submit", submitQR)



export default router