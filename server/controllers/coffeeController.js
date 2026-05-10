import Coffee from "../models/Coffee.js";

// GET all coffees — supports optional ?category= and ?featured= filters
export const getAllCoffees = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.featured === 'true') filter.featured = true;

        const coffees = await Coffee.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: coffees.length, coffees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET single coffee by ID
export const getCoffeeById = async (req, res) => {
    try {
        const coffee = await Coffee.findById(req.params.id);
        if (!coffee) return res.status(404).json({ success: false, message: "Coffee not found" });
        res.json({ success: true, coffee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST create a new coffee (admin only)
export const addCoffee = async (req, res) => {
    const { name, price } = req.body || {};

    if (!name || price === undefined) {
        return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    try {
        const coffee = await Coffee.create(req.body);
        res.status(201).json({ success: true, message: "Coffee added", coffee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT update coffee by ID (admin only) — supports all schema fields
export const updateCoffee = async (req, res) => {
    try {
        const coffee = await Coffee.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!coffee) return res.status(404).json({ success: false, message: "Coffee not found" });
        res.json({ success: true, message: "Coffee updated", coffee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE coffee by ID (admin only)
export const deleteCoffee = async (req, res) => {
    try {
        const coffee = await Coffee.findByIdAndDelete(req.params.id);
        if (!coffee) return res.status(404).json({ success: false, message: "Coffee not found" });
        res.json({ success: true, message: "Coffee deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
