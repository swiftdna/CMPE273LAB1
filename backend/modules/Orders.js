const _ = require('underscore');
const { getOrderDetailsWithOrders, getOrderDetails } = require('./OrderDetails');
const { getProductByIDs, modifyProduct } = require('./Products');

const getOrders = async (req, res, next) => {
	// console.log('req.session -> ', req.session);
	const { details } = req.query;
	const { passport: {user: {id: user_id}} } = req.session;
	const { models: { order: Order } } = COREAPP;
	console.log('getOrders -> user_id - ', user_id);
	try {
		const orders = await Order.findAll({
	        where: {
	            user_id: user_id,
				status: 'active',
	        },
	        order: [
				['createdAt', 'DESC']
			],
			raw: true
	    });
    	console.log('orders -> ', orders);
    	if (orders) {
			if (!details) {
				res.json({
					success: true,
					data: orders
				});
			} else {
				// Pull details
				const ordersArr = _.pluck(orders, 'id');
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
							order.details = orderDetails.filter(ordDtl => ordDtl.order_id === order.id);
							order.details.map(dtl => {
								const prodDetailsArr = productDetails.filter(prod => dtl.item_id === prod.id);
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
	const { models: { order: Order } } = COREAPP;
	// Image upload to be handled
	try {
		const orderData = await Order.create(body);
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
	const { passport: {user: {id: user_id}} } = req.session;
	const { models: { order: Order } } = COREAPP;
	console.log('getOrders -> user_id - ', user_id);
	try {
		const orders = await Order.findAll({
	        where: {
	            user_id,
	            status: 'draft'
	        }
	    });
    	if (orders && orders.length) {
    		res.json({
    			success: true,
    			data: orders[0]
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
	const {models: {order: Order}} = COREAPP;
	console.log('getOrder -> order_id - ', order_id);
	try {
		const order = await Order.findOne({
	        where: {
	            id: order_id
	        }
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
		return next();
	}
};

const modifyOrder = async (req, res, next) => {
	const { order_id } = req.params;
	const { body } = req;
	const { models: {order: Order}} = COREAPP;
	// Image upload to be handled
	// console.log('updateUserDetails -> user_id - ', user_id);
	try {
		const orderData = await Order.findOne({
			where: {
				id: order_id
			}
		});
		if (orderData && orderData.id) {
			// Get products in this order and 
			orderData.update(body);
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
								const filteredProductsArr = productData.filter(product => product.id === order.item_id);
								const [productObj] = filteredProductsArr && filteredProductsArr.length ? filteredProductsArr : [null];
								const {id, qty} = productObj ? productObj : {};
								// construct modified qty
								if (qty >= order.qty) {
									// reduce it
									productObj.qty = qty - order.qty;
								}
								delete productObj.id;
								modifyProduct({ id, body: productObj}, (err, result) => {
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
	const { models: { order: Order } } = COREAPP;
	try {
		const orderData = await Order.destroy({
	        where: {
	            id: order_id
	        }
	    });
	    res.json({
        	success: true,
        	message: 'Order removed!',
        	data: orderData
        });
        return next();
	} catch(err) {
    	console.log('removeOrder ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
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