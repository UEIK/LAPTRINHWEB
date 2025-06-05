const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');


const uploadDir = '../frontend/public/Img_project';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public/Img_project/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);
router.post('/', upload.array('images', 10), productController.createProduct);
router.put('/:id', upload.array('images', 10), productController.updateProduct);

module.exports = router;