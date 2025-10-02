import express from "express";
import { addPhoto } from "../controllers/photoController.js";

const router = express.Router();



router.post("/create", addPhoto)



export default router