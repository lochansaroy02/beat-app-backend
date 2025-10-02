import express from "express";
import { createMember, fetchMembers } from "../controllers/memberController.js";
const router = express.Router();
router.post("/create", createMember);
router.get("/fetch", fetchMembers);
export default router;
//# sourceMappingURL=familyMemberRoutes.js.map