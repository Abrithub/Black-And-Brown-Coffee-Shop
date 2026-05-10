import express from "express";
import {
    getAllCoffees,
    getCoffeeById,
    addCoffee,
    updateCoffee,
    deleteCoffee
} from "../controllers/coffeeController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllCoffees);
router.get("/:id", getCoffeeById);

// Admin only
router.post("/", protect, adminProtect, addCoffee);
router.put("/:id", protect, adminProtect, updateCoffee);
router.delete("/:id", protect, adminProtect, deleteCoffee);

export default router;
