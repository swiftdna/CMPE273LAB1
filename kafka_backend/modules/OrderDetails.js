const {ObjectId} = require('mongodb');

const getOrderDetails = async (req, callback) => {
	// console.log('req.session -> ', req.session);
	const { order_id } = req.params;
	const {db} = COREAPP;
	const order_details = db.collection('order_details');
	// console.log('getOrderDetails -> order_id - ', order_id);
	try {
		const orderDetails = await order_details.find({
	        order_id
	    }).toArray();
    	// console.log('orders -> ', orderDetails);
    	if (orderDetails) {
    		return callback(null, {
    			success: true,
    			data: orderDetails
    		});
    	}
		return callback(null, {
			success: true,
			data: [],
			message: 'OrderDetails not found!'
		});
    } catch (err) {
    	console.log('getOrderDetails ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getOrderDetailsWithOrders = async (req, callback) => {
	const { orders } = req.params;
	const {db} = COREAPP;
	const order_details = db.collection('order_details');

	// console.log('getOrderDetails -> orders - ', orders);
	try {
		const orderDetails = await order_details.find({
			order_id: {
				$in: orders
			}
	    }).toArray();
    	// console.log('orderDetails -> ', orderDetails);
    	if (orderDetails) {
    		return callback(null, {
    			success: true,
    			data: orderDetails
    		});
		}
		return callback(null, {
			success: true,
			data: [],
			message: 'OrderDetails not found!'
		});
    } catch (err) {
    	console.log('getOrderDetails ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
}

const getOrderDetail = async (req, callback) => {
	const { id } = req.params;
	const {db} = COREAPP;
	const order_details = db.collection('order_details');
	// console.log('getOrderDetail -> id - ', id);
	try {
		const orderDetails = await order_details.find({
	        _id: ObjectId(id)
	    });
    	// console.log('orderDetails -> ', orderDetails);
    	if (orderDetails) {
    		return callback(null, {
    			success: true,
    			data: orderDetails
    		});
    	}
		return callback(null, {
			success: true,
			data: {},
			message: 'OrderDetails not found!'
		});
    } catch (err) {
    	console.log('getOrderDetail ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const addOrderDetails = async (req, callback) => {
	const { body } = req;
	const {db} = COREAPP;
	const order_details = db.collection('order_details');
	// Image upload to be handled
	try {
		body.createdAt = +new Date;
		body.modifiedAt = +new Date;
		const orderData = await order_details.insertOne(body);
		if (!orderData) {
            return res.json({success: false, message: 'Unable to add order'});
        }
        return callback(null, {
        	success: true,
        	message: 'New item added to the order!',
        	data: orderData
        });
	} catch(err) {
    	console.log('addOrderDetails ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

const modifyOrderDetails = async (req, callback) => {
	const { order_dtl_id } = req.params;
	const { body } = req;
	const {db} = COREAPP;
	const order_details = db.collection('order_details');
	// Image upload to be handled
	// console.log('updateUserDetails -> user_id - ', user_id);
	try {
		const orderDtlData = await order_details.findOne({
			_id: ObjectId(order_dtl_id)
		});
		if (orderDtlData && orderDtlData._id) {
			await order_details.updateOne({
				_id: ObjectId(order_dtl_id)
			}, {$set: body});
			return callback(null, {
				success: true,
				message: 'Update successful!',
				cartID: orderDtlData.order_id
			});
		} else {
			return callback({success: false, message: 'Order Detail not found in the database'});
		}
	} catch(err) {
		console.log('modifyOrderDetails ERR!! -> ', err);
		return callback({
			success: false,
			message: err.message
		});
	}
};

const removeOrderDetails = async (req, callback) => {
	const { cart_item_id } = req.params;
	const {db} = COREAPP;
	const order_details = db.collection('order_details');
	try {
		const orderData = await order_details.remove({
	        _id: ObjectId(cart_item_id)
	    });
	    return callback(null, {
        	success: true,
        	message: 'OrderDetails removed!',
        	data: orderData
        });
	} catch(err) {
    	console.log('removeOrderDetails ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

const getSalesCountByItemID = async (itemIDs) => {
	// attributes: ['itemId', [sequelize.fn('sum', sequelize.col('amount')), 'total']]
	return new Promise(async (resolve, reject) => {
		const {db} = COREAPP;
		const order_details = db.collection('order_details');
		// console.log('getSalesCountByItemID -> itemIDs - ', itemIDs);
		try {
			const orderDetails = await order_details.aggregate([
				{
				  $group:
					{
					  _id: "$item_id",
					  sales: { 
						  $sum: "$qty"
					  }
					}
				}
			  ]
			).toArray();
	    	// console.log('salesCount -> ', orderDetails);
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
};

// const getOverallSalesCountByItemIDs = async (itemIDs) => {
// 	// attributes: ['itemId', [sequelize.fn('sum', sequelize.col('amount')), 'total']]
// 	return new Promise(async (resolve, reject) => {
// 		const { models: { order_detail: OrderDetail } } = COREAPP;
// 		const Op = Sequelize.Op;

// 		console.log('getOverallSalesCountByItemIDs -> itemIDs - ', itemIDs);
// 		try {
// 			const salesData = await OrderDetail.findAll({
// 		        where: {
// 		            item_id: {
// 						[Op.in]: itemIDs
// 					}
// 		        },
// 		        attributes: [[Sequelize.fn('sum', Sequelize.col('qty')), 'sales']],
// 		        raw: true
// 		    });
// 	    	console.log('salesCount -> ', salesData);
// 	    	if (salesData) {
// 	    		return resolve(salesData);
// 	    	} else {
// 	    		return resolve([]);
// 	    	}
// 	    } catch (err) {
// 	    	console.log('getOverallSalesCountByItemIDs ERR!! -> ', err);
// 	    	return reject(err);
// 		}
// 	});
// }

module.exports = { 
	getOrderDetails,
	getOrderDetail,
	addOrderDetails,
	getSalesCountByItemID,
	// getOverallSalesCountByItemIDs,
	modifyOrderDetails,
	getOrderDetailsWithOrders,
	removeOrderDetails
};