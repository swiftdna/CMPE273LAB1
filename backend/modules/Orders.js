const _ = require('underscore');
const { getOrderDetailsWithOrders, getOrderDetails } = require('./OrderDetails');
const { getProductByIDs, modifyProduct } = require('./Products');
const {ObjectId} = require('mongodb');

const getOrders = async (req, res, next) => {
	// console.log('req.session -> ', req.session);
	const { details } = req.query;
	const { user: {_id: user_id} } = req;
	const { db } = COREAPP;
	const Order = db.collection('orders');
	console.log('getOrders -> user_id - ', user_id);
	try {
		const orders = await Order.find({
			user_id: user_id,
			status: 'active'
		}).sort({createdAt: 'desc'}).toArray();
    	console.log('orders -> ', orders);
    	if (orders) {
			if (!details) {
				res.json({
					success: true,
					data: orders
				});
			} else {
				// Pull details
				let ordersArr = _.pluck(orders, '_id');
				ordersArr = ordersArr.map(orderid => ObjectId(orderid).toString());
				req.params.orders = ordersArr.slice();
				req.model = {};
				return getOrderDetailsWithOrders(req, res, () => {
					console.log('model data', req.model.data);
					const {data: orderDetails} = req.model.data;
					const productsArr = _.uniq(_.pluck(orderDetails, 'item_id'));
					req.query.productIDs = productsArr;
					return getProductByIDs(req, res, () => {
						const {data: productDetails} = req.model;
						// Arrange data for UI
						orders.map(order => {
							order.details = orderDetails.filter(ordDtl => ordDtl.order_id === ObjectId(order._id).toString());
							order.details.map(dtl => {
								const prodDetailsArr = productDetails.filter(prod => dtl.item_id === ObjectId(prod._id).toString());
								dtl.product = prodDetailsArr && prodDetailsArr.length ? prodDetailsArr[0] : {};
							})
						});
						res.json({
							success: true,
							data: orders
						});
					});
				});
			}
    	} else {
    		res.json({
    			success: true,
    			data: [],
    			message: 'Orders not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getOrders ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const addOrder = async (req, res, next) => {
	const { body } = req;
	const {db} = COREAPP;
	const orders = db.collection('orders');
	// Image upload to be handled
	try {
		const orderData = await orders.insertOne(body);
		if (!orderData) {
            return res.json({success: false, message: 'Unable to add order'});
        }
        res.json({
        	success: true,
        	message: 'New order added!',
        	data: orderData
        });
        return next();
	} catch(err) {
    	console.log('addOrder ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

const getCartOrder = async (req, res, next) => {
	// console.log('req.session -> ', req.session);
	const { user: {_id: user_id} } = req;
	const {db} = COREAPP;
	const orders = db.collection('orders');
	console.log('getOrders -> user_id - ', user_id);
	try {
		const ordersData = await orders.find({
			user_id,
			status: 'draft'
	    }).toArray();
		console.log('ordersData -> ', ordersData);
    	if (ordersData && ordersData.length) {
    		res.json({
    			success: true,
    			data: ordersData[0]
    		});
    	} else {
    		// construct draft order for cart
    		req.body = {
				user_id,
				total: 0,
	            status: 'draft'
    		};
    		return addOrder(req, res, next);
    	}
    	return next();
    } catch (err) {
    	console.log('getOrders ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const getOrder = async (req, res, next) => {
	const { order_id } = req.params;
	const {db} = COREAPP;
	const orders = db.collection('orders');
	console.log('getOrder -> order_id - ', order_id);
	try {
		const order = await orders.findOne({
	        _id: ObjectId(order_id)
	    });
    	console.log('order -> ', order);
    	if (order) {
    		res.json({
    			success: true,
    			data: order
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Order not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getOrder ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const modifyOrder = async (req, res, next) => {
	const { order_id } = req.params;
	const { body } = req;
	const { db } = COREAPP;
	const Order = db.collection('orders');

	// Image upload to be handled
	// console.log('updateUserDetails -> user_id - ', user_id);
	try {
		const orderData = await Order.findOne({
			_id: ObjectId(order_id)
		});
		if (orderData && orderData._id) {
			// Get products in this order and 
			await Order.updateOne({
				_id: ObjectId(order_id)
			}, {
				$set: body
			});
			req.model = {};

			return getOrderDetails(req, res, () => {
				const { data: {data: orderData} } = req.model;
				const productIDs = _.pluck(orderData, 'item_id');
				req.query.productIDs = productIDs;
				return getProductByIDs(req, res, async () => {
					const { data: productData } = req.model;
					await Promise.all(
						orderData.map(order => {
							return new Promise((resolve, reject) => {
								const filteredProductsArr = productData.filter(product => ObjectId(product._id).toString() === order.item_id);
								const [productObj] = filteredProductsArr && filteredProductsArr.length ? filteredProductsArr : [null];
								const {_id, qty} = productObj ? productObj : {};
								// construct modified qty
								if (qty >= order.qty) {
									// reduce it
									productObj.qty = qty - order.qty;
								}
								delete productObj._id;
								modifyProduct({ id: ObjectId(_id).toString(), body: productObj}, (err, result) => {
									if (err)
										reject(err);
									resolve(result);
								});
							});
						}
					));
					res.json({
						success: true,
						message: 'Update successful!',
						data: req.model.data
					});
				});
			});
		} else {
			return res.json({success: false, message: 'Order not found in the database'});
		}
	} catch(err) {
		console.log('modifyOrder ERR!! -> ', err);
		res.json({
			success: false,
			message: err.message
		});
		return next();
	}
}

const removeOrder = async (req, res, next) => {
	const { order_id } = req.params;
	const {db} = COREAPP;
	const orders = db.collection('orders');
	try {
		const orderData = await orders.remove({
	        _id: ObjectId(order_id)
	    });
	    res.json({
        	success: true,
        	message: 'Order removed!',
        	data: orderData
        });
	} catch(err) {
    	console.log('removeOrder ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
    }
};

module.exports = { 
	getOrders,
	getOrder,
	getCartOrder,
	addOrder,
	modifyOrder,
	removeOrder
};