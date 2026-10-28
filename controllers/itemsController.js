const Item = require("../models/ItemModel");

// GET all active items
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

// GET all items (including inactive) - for admin
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

// POST create item
const createItem = async (req, res) => {
  try {
    const { itemId, name, value, category } = req.body;
    if (!itemId || !name) {
      return res.status(400).json({ message: "itemId and name are required" });
    }
    const existing = await Item.findOne({ itemId });
    if (existing) {
      return res.status(400).json({ message: "Item ID already exists" });
    }
    const item = new Item({ itemId, name, value: value || 0, category: category || "" });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
};

// PUT update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, category, isActive } = req.body;
    const item = await Item.findByIdAndUpdate(
      id,
      { name, value, category, isActive },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
};

// DELETE item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};

module.exports = { getItems, getAllItems, createItem, updateItem, deleteItem };
