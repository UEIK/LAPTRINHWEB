const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name'],
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
    }
};

const getSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.query;
        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ error: 'categoryId is required and must be a number' });
        }

        const subcategories = await SubCategory.findAll({
            where: { category_id: Number(categoryId) },
            attributes: ['id', 'name'],
        });
        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Failed to fetch subcategories', details: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const category = await Category.create({ name });

        res.status(201).json({
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const productCount = await Product.count({ where: { category_id: id } });
        if (productCount > 0) {
            await Product.destroy({ where: { category_id: id } });
            console.log(`Deleted ${productCount} products associated with category ${id}`);
        }

        await SubCategory.destroy({ where: { category_id: id } });
        await category.destroy();

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
};

const createSubcategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        if (!name || !categoryId) {
            return res.status(400).json({
                error: "Subcategory name and category ID are required"
            });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: "Parent category not found" });
        }

        const existingSubcategory = await SubCategory.findOne({
            where: { name, category_id: categoryId }
        });
        if (existingSubcategory) {
            return res.status(400).json({ error: "Subcategory already exists" });
        }

        const subcategory = await SubCategory.create({
            name,
            category_id: categoryId
        });

        res.status(201).json({
            message: "Subcategory created successfully",
            subcategory,
        });
    } catch (error) {
        console.error("Error creating subcategory:", error);
        res.status(500).json({ error: "Failed to create subcategory" });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;

        const subcategory = await SubCategory.findByPk(id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const productCount = await Product.count({
            where: { subcategory_id: id }
        });
        if (productCount > 0) {
            await Product.destroy({ where: { subcategory_id: id } });
            console.log(`Deleted ${productCount} products associated with subcategory ${id}`);
        }

        await subcategory.destroy();

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({ message: 'Error deleting subcategory' });
    }
};

module.exports = { getCategories, getSubcategories, createCategory, deleteCategory, createSubcategory, deleteSubcategory };