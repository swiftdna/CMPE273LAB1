const _ = require('underscore');
const { getOrderDetailsWithOrders, getOrderDetails } = require('./OrderDetails');
const { getProductByIDs, modifyProduct } = require('./Products');
const {ObjectId} = require('mongodb');

const getOrders = async (req, callback) => {
	// console.log('req.session -> ', req.session);
	const { details, limit, skip } = req.query;
	const { user: {_id: user_id} } = req;
	const { db } = COREAPP;
	const Order = db.collection('orders');
	console.log('getOrders -> user_id - ', user_id);
	try {
		const orders = await Order.find({
			user_id: user_id,
			status: 'active'
		})
		.sort({createdAt: 'desc'})
		.skip(skip ? Number(skip) : 0)
		.limit(limit ? Number(limit) : 0)
		.toArray();
		const totalOrdersCount = await Order.countDocuments({
			user_id: user_id,
			status: 'active'
		});
    	console.log('orders -> ', orders);
    	if (orders) {
			if (!details) {
				return callback(null, {
					success: true,
					data: orders,
					total: totalOrdersCount
				});
			} else {
				// Pull details
				let ordersArr = _.pluck(orders, '_id');
				ordersArr = ordersArr.map(orderid => ObjectId(orderid).toString());
				req.params.orders = ordersArr.slice();
				req.model = {};
				return getOrderDetailsWithOrders(req, (err, orderDetailsResponse) => {
					console.log('model data', req.model.data);
					const {data: orderDetails} = orderDetailsResponse;
					const productsArr = _.uniq(_.pluck(orderDetails, 'item_id'));
					req.query.productIDs = productsArr;
					return getProductByIDs(req, (err, productDetails) => {
						// Arrange data for UI
						orders.map(order => {
							order.details = orderDetails.filter(ordDtl => ordDtl.order_id === ObjectId(order._id).toString());
							order.details.map(dtl => {
								const prodDetailsArr = productDetails.filter(prod => dtl.item_id === ObjectId(prod._id).toString());
								dtl.product = prodDetailsArr && prodDetailsArr.length ? prodDetailsArr[0] : {};
							})
						});
						return callback(null, {
							success: true,
							data: orders,
							total: totalOrdersCount
						});
					});
				});
			}
    	} else {
    		return callback(null, {
    			success: true,
    			data: [],
    			message: 'Orders not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getOrders ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const addOrder = async (req, callback) => {
	const { body } = req;
	const {db} = COREAPP;
	const orders = db.collection('orders');
	// Image upload to be handled
	try {
		body.createdAt = +new Date;
		body.modifiedAt = +new Date;
		const orderData = await orders.insertOne(body);
		if (!orderData) {
            return res.json({success: false, message: 'Unable to add order'});
        }
        return callback(null, {
        	success: true,
        	message: 'New order added!',
        	data: orderData
        });
	} catch(err) {
    	console.log('addOrder ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

const getCartOrder = async (req, callback) => {
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
    		return callback(null, {
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
    		return addOrder(req, callback);
    	}
    } catch (err) {
    	console.log('getOrders ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getOrder = async (req, callback) => {
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
    		return callback(null, {
    			success: true,
    			data: order
    		});
    	} else {
    		return callback(null, {
    			success: true,
    			data: {},
    			message: 'Order not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getOrder ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const modifyOrder = async (req, callback) => {
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

			return getOrderDetails(req, (err, orderDetailsResponse) => {
				// console.log('orderData -> ', orderData);
				const {data: orderData} = orderDetailsResponse;
				const productIDs = _.pluck(orderData, 'item_id');
				req.query.productIDs = productIDs;
				return getProductByIDs(req, async (err, productData) => {
				console.log('productData =>>>> ', productData);
					// const { data: productData } = productResponse;
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
								modifyProduct({ item_id: ObjectId(_id).toString(), body: productObj}, (err, result) => {
									if (err)
										reject(err);
									resolve(result);
								});
							});
						}
					));
					return callback(null, {
						success: true,
						message: 'Update successful!',
						data: productData
					});
				});
			});
		} else {
			return callback({success: false, message: 'Order not found in the database'});
		}
	} catch(err) {
		console.log('modifyOrder ERR!! -> ', err);
		return callback({
			success: false,
			message: err.message
		});
	}
}

const removeOrder = async (req, callback) => {
	const { order_id } = req.params;
	const {db} = COREAPP;
	const orders = db.collection('orders');
	try {
		const orderData = await orders.remove({
	        _id: ObjectId(order_id)
	    });
	    return callback(null, {
        	success: true,
        	message: 'Order removed!',
        	data: orderData
        });
	} catch(err) {
    	console.log('removeOrder ERR!! -> ', err);
    	return callback({
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