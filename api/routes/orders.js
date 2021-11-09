const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orders');
const authController = require('../middleware/authMiddleware');

router.get('/', OrderController.orders_get_all);

router.post('/', authController, OrderController.order_create);

router.get('/:orderId', OrderController.get_order);

router.patch('/:orderId', authController, OrderController.update_order);

router.delete('/:orderId', authController, OrderController.delete_order);


module.exports = router