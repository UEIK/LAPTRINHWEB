const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/SubCategory');
const Gallery = require('../models/Gallery');
const ProductSize = require('../models/ProductSize');
const CartItem = require("../models/CartItem");

const searchProducts = async (req, res) => {
    try {
        const {
            query = '',
            category,
            subcategory,
            colors,
            sizes,
            priceMin = 0,
            priceMax = 10000,
            sortBy,
            page = 1,
            limit = 16,
        } = req.query;

        const where = {};

        if (query) {
            where[Op.or] = [
                { name: { [Op.like]: `%${query}%` } },
            ];
        }

        if (category) {
            const categoryRecord = await Category.findOne({ where: { name: category } });
            if (categoryRecord) {
                where.category_id = categoryRecord.id;
            } else {
                return res.status(400).json({ message: 'Category not found' });
            }
        }

        if (subcategory) {
            const subcategoryRecord = await Subcategory.findOne({ where: { name: subcategory } });
            if (subcategoryRecord) {
                where.subcategory_id = subcategoryRecord.id;
            } else {
                return res.status(400).json({ message: 'Subcategory not found' });
            }
        }

        if (colors) {
            const colorArray = colors.split(',');
            where.color = { [Op.in]: colorArray };
        }

        where.price = {
            [Op.between]: [Number(priceMin), Number(priceMax)],
        };

        const order = [];
        if (sortBy === 'low-to-high') {
            order.push(['price', 'ASC']);
        } else if (sortBy === 'high-to-low') {
            order.push(['price', 'DESC']);
        }

        const offset = (page - 1) * limit;

        let sizeFilter = {};
        if (sizes) {
            const sizeArray = sizes.split(',');
            sizeFilter = { size: { [Op.in]: sizeArray } };
        }

        const include = [
            {
                model: Gallery,
                attributes: ['thumbnail'],
                required: false, // LEFT JOIN
            },
            {
                model: ProductSize,
                as: 'Sizes',
                attributes: ['size'],
                where: sizes ? sizeFilter : undefined,
                required: sizes ? true : false,
            },
        ];

        const { count, rows } = await Product.findAndCountAll({
            where,
            include,
            order,
            offset,
            limit: Number(limit),
            distinct: true,
        });

        const totalPages = Math.ceil(count / limit);

        const products = rows.map((product) => ({
            ...product.toJSON(),
            thumbnail: product.Galleries?.[0]?.thumbnail || null,
            sizes: product.Sizes.map((size) => size.size),
        }));

        res.status(200).json({
            products,
            totalPages,
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Gallery,
                    attributes: ['thumbnail'],
                    required: false,
                },
                {
                    model: ProductSize,
                    as: 'Sizes',
                    attributes: ['size'],
                    required: false,
                },
                {
                    model: Category,
                    attributes: ['name'],
                    required: false,
                },
                {
                    model: Subcategory,
                    attributes: ['name'],
                    required: false,
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productData = {
            ...product.toJSON(),
            thumbnail: product.Galleries?.[0]?.thumbnail || null,
            sizes: product.Sizes.map((size) => size.size),
            category: product.Category?.name || null,
            subcategory: product.Subcategory?.name || null,
            description: product.description,
        };

        res.status(200).json(productData);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await CartItem.destroy({
            where: { product_id: id },
        });

        await product.destroy();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description, color, categoryId, subcategoryId, sizes } = req.body;
        const images = req.files;

        if (!name || !price || !categoryId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }
        if (subcategoryId && subcategoryId !== '') {
            const subcategory = await Subcategory.findOne({
                where: { id: subcategoryId, category_id: categoryId },
            });
            if (!subcategory) {
                return res.status(400).json({ error: 'Invalid subcategoryId or subcategory does not belong to category' });
            }
        }

        const product = await Product.create({
            name,
            price: Number(price),
            description,
            color: color || null,
            category_id: categoryId,
            subcategory_id: subcategoryId || null,
            title: name,
        });

        if (sizes) {
            const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
            for (const size of sizeArray) {
                await ProductSize.create({
                    product_id: product.id,
                    size,
                });
            }
        }

        if (images && images.length > 0) {
            for (const image of images) {
                const filePath = `/Img_project/${image.filename}`;
                await Gallery.create({
                    product_id: product.id,
                    thumbnail: filePath,
                });
            }
        }

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, color, categoryId, subcategoryId, sizes } = req.body;
        const images = req.files;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        product.name = name;
        product.price = Number(price);
        product.description = description || null;
        product.color = color || null;
        product.category_id = categoryId || null;
        product.subcategory_id = subcategoryId || null;
        product.title = name;
        await product.save();

        // Cập nhật size: xóa hết và thêm lại
        await ProductSize.destroy({ where: { product_id: id } });
        const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
        for (const size of sizeArray) {
            await ProductSize.create({ product_id: id, size });
        }

        // Cập nhật ảnh nếu có ảnh mới
        if (images && images.length > 0) {
            await Gallery.destroy({ where: { product_id: id } });
            for (const image of images) {
                const filePath = `/Img_project/${image.filename}`;
                await Gallery.create({ product_id: id, thumbnail: filePath });
            }
        }

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};


module.exports = { searchProducts, getProductById, deleteProduct, createProduct, updateProduct };