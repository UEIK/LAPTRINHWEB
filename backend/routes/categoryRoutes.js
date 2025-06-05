const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);
router.get('/subcategories', categoryController.getSubcategories);
router.post('/', categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);
router.post('/subcategories', categoryController.createSubcategory);
router.delete('/subcategories/:id', categoryController.deleteSubcategory);

module.exports = router;