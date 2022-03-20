const Sequelize = require("sequelize");

const getOrderDetails = async (req, res, next) => {
	// console.log('req.session -> ', req.session);
	const { order_id } = req.params;
	const { models: { order_detail: OrderDetail } } = COREAPP;
	console.log('getOrderDetails -> order_id - ', order_id);
	try {
		const orderDetails = await OrderDetail.findAll({
	        where: {
	            order_id
	        },
	        raw: true
	    });
    	console.log('orders -> ', orderDetails);
    	if (orderDetails) {
    		req.model.data = {
    			success: true,
    			data: orderDetails
    		};
    	} else {
    		res.json({
    			success: true,
    			data: [],
    			message: 'OrderDetails not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getOrderDetails ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const getOrderDetailsWithOrders = async (req, res, next) => {
	const { orders } = req.params;
	const { models: { order_detail: OrderDetail } } = COREAPP;
	const Op = Sequelize.Op;

	console.log('getOrderDetails -> orders - ', orders);
	try {
		const orderDetails = await OrderDetail.findAll({
	        where: {
	            order_id: {
					[Op.in]: orders
				}
	        },
	        raw: true
	    });
    	console.log('orderDetails -> ', orderDetails);
    	if (orderDetails) {
    		req.model.data = {
    			success: true,
    			data: orderDetails
    		};
    	} else {
    		res.json({
    			success: true,
    			data: [],
    			message: 'OrderDetails not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getOrderDetails ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
}

const getOrderDetail = async (req, res, next) => {
	const { id } = req.params;
	const { models: { order_detail: OrderDetail } } = COREAPP;
	console.log('getOrderDetail -> id - ', id);
	try {
		const orderDetails = await OrderDetail.findOne({
	        where: {
	           id
	        }
	    });
    	// console.log('orderDetails -> ', orderDetails);
    	if (orderDetails) {
    		res.json({
    			success: true,
    			data: orderDetails
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'OrderDetails not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getOrderDetail ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const addOrderDetails = async (req, res, next) => {
	const { body } = req;
	const { models: { order_detail: OrderDetail } } = COREAPP;
	// Image upload to be handled
	try {
		const orderData = await OrderDetail.create(body);
		if (!orderData) {
            return res.json({success: false, message: 'Unable to add order'});
        }
        res.json({
        	success: true,
        	message: 'New item added to the order!',
        	data: orderData
        });
        return next();
	} catch(err) {
    	console.log('addOrderDetails ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

const modifyOrderDetails = async (req, res, next) => {
	const { order_dtl_id } = req.params;
	const { body } = req;
	const { models: {order_detail: OrderDetail }} = COREAPP;
	// Image upload to be handled
	// console.log('updateUserDetails -> user_id - ', user_id);
	try {
		const orderDtlData = await OrderDetail.findOne({
			where: {
				id: order_dtl_id
			}
		});
		if (orderDtlData && orderDtlData.id) {
			orderDtlData.update(body);
				res.json({
					success: true,
					message: 'Update successful!'
				});
			return next();
		} else {
			return res.json({success: false, message: 'Order Detail not found in the database'});
		}
	} catch(err) {
		console.log('modifyOrderDetails ERR!! -> ', err);
		res.json({
			success: false,
			message: err.message
		});
		return next();
	}
};

const removeOrderDetails = async (req, res, next) => {
	const { order_id } = req.params;
	const { models: { order_detail: OrderDetail } } = COREAPP;
	try {
		const orderData = await OrderDetail.destroy({
	        where: {
	            id: order_id
	        }
	    });
	    res.json({
        	success: true,
        	message: 'OrderDetails removed!',
        	data: orderData
        });
        return next();
	} catch(err) {
    	console.log('removeOrderDetails ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

const getSalesCountByItemID = async (itemIDs) => {
	// attributes: ['itemId', [sequelize.fn('sum', sequelize.col('amount')), 'total']]
	return new Promise(async (resolve, reject) => {
		const { models: { order_detail: OrderDetail } } = COREAPP;
		const Op = Sequelize.Op;

		console.log('getSalesCountByItemID -> itemIDs - ', itemIDs);
		try {
			const orderDetails = await OrderDetail.findAll({
		        where: {
		            item_id: {
						[Op.in]: itemIDs
					}
		        },
		        attributes: ['item_id', [Sequelize.fn('sum', Sequelize.col('qty')), 'sales']],
		        group : ['item_id'],
		        raw: true
		    });
	    	console.log('salesCount -> ', orderDetails);
	    	if (orderDetails) {
	    		return resolve(orderDetails);
	    	} else {
	    		return resolve([]);
	    	}
	    } catch (err) {
	    	console.log('getSalesCountByItemID ERR!! -> ', err);
	    	return reject(err);
		}
	});
}

const getOverallSalesCountByItemIDs = async (itemIDs) => {
	// attributes: ['itemId', [sequelize.fn('sum', sequelize.col('amount')), 'total']]
	return new Promise(async (resolve, reject) => {
		const { models: { order_detail: OrderDetail } } = COREAPP;
		const Op = Sequelize.Op;

		console.log('getOverallSalesCountByItemIDs -> itemIDs - ', itemIDs);
		try {
			const salesData = await OrderDetail.findAll({
		        where: {
		            item_id: {
						[Op.in]: itemIDs
					}
		        },
		        attributes: [[Sequelize.fn('sum', Sequelize.col('qty')), 'sales']],
		        raw: true
		    });
	    	console.log('salesCount -> ', salesData);
	    	if (salesData) {
	    		return resolve(salesData);
	    	} else {
	    		return resolve([]);
	    	}
	    } catch (err) {
	    	console.log('getOverallSalesCountByItemIDs ERR!! -> ', err);
	    	return reject(err);
		}
	});
}

module.exports = { 
	getOrderDetails,
	getOrderDetail,
	addOrderDetails,
	getSalesCountByItemID,
	getOverallSalesCountByItemIDs,
	modifyOrderDetails,
	getOrderDetailsWithOrders,
	removeOrderDetails
};