const Order = require('../models/orders');
const Product = require('../models/products');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
	Order
		.find()
		.select('quantity product')
		.populate('product', 'name')
		.exec()
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				orders: docs.map(doc => {
					return {
						_id: doc._id,
						product: doc.product,
						quantity: doc.quantity,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/orders/' + doc._id
						}
					}
				})
			})
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		});
}
exports.order_create = (req, res, next) => {
	Product.findById(req.body.productId)
		.then(product => {
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				product: req.body.productId,
				quantity: req.body.quantity

			});
			return order.save()
		})
		.then(result => {
			res.status(201).json({
				message: 'Order created successfully',
				createdOrder: {
					product: result.product,
					quantity: result.quantity,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/orders/' + result._id
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: 'Product is not found',
				error: err
			})
		})

}
exports.get_order = (req, res, next) => {
	const id = req.params.orderId;
	Order.findById(id)
		.select('product quantity _id')
		.populate('product')
		.exec()
		.then(order => {
			if (!order) {
				return res.status(404).json({
					message: "Order not found"
				})
			}
			res.status(200).json({
				order: order,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + id
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}
exports.update_order = (req, res, next) => {
	const id = req.params.orderId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Order.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result);
			res.status(200).json({
				message: 'Order updated',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + id
				}
			})
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
}
exports.delete_order = (req, res, next) => {
	const id = req.params.orderId;
	Order
		.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Order removing successfully',
				request: {
					type: 'POST',
					url: 'http://localhost:3000/orders',
					data: {
						product: 'ObjectId',
						quantity: 'Number'
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		})
}
