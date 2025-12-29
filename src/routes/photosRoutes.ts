import express from "express";
import { addPhoto, getPhotoByID } from "../controllers/photoController.js";

const router = express.Router();



router.post("/create", addPhoto)
router.post("/get", getPhotoByID)



export default router