const express = require('express');
const router = express.Router();
const multer = require('multer');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + file.originalname)
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
})

router.get('/', ProductController.get_all_products);

router.post('/', upload.single('productImage'), ProductController.create_product);

router.get('/:productId', ProductController.create_product);

router.patch('/:productId', ProductController.update_product);

router.delete('/:productId', ProductController.delete_product);

module.exports = router