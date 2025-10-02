var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../utils/prisma.js";
// ✅ Create member
export const createMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { relation, name, age, occupation, personId } = req.body;
    try {
        // Validate inputs
        if (!relation || !name || !age || !occupation) {
            return res.status(400).json({
                message: "Please enter all required fields",
            });
        }
        // Check if relation already exists
        const existingRelation = yield prisma.familyMember.findUnique({
            where: {
                relation,
            },
        });
        if (existingRelation) {
            return res.status(409).json({
                message: "Relation already exists",
            });
        }
        // Create new member
        const newMember = yield prisma.familyMember.create({
            data: {
                relation,
                name,
                age,
                occupation,
                personId
            },
        });
        res.status(201).json({
            message: "Member created successfully",
            data: newMember,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error,
        });
    }
});
// ✅ Fetch districts
export const fetchMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.familyMember.findMany();
        res.status(200).json({ message: "Data fetched", data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
//# sourceMappingURL=familyMemberController.js.map