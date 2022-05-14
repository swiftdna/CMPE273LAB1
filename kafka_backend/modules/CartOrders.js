const { getOrderDetails, addOrderDetails, modifyOrderDetails, removeOrderDetails } = require('./OrderDetails');
const { getProductByIDs } = require('./Products');
const _ = require('underscore');

const getCartItems = (req, callback) => {
	const { cart_id } = req.params;
	req.params.order_id = cart_id;
	req.model = {};
	return getOrderDetails(req, (err, orderResponse) => {
		const {data} = orderResponse;
		const productIDs = _.pluck(data, 'item_id');
		req.query = {productIDs};
		const temp = [];
		return getProductByIDs(req, (err, productResponse) => {
			const products = productResponse;
			for (let x = 0; x < data.length; x++) {
				// console.log('data[x] ===> ', data[x]);
				if (data[x].item_id) {
					data[x].product = {};
					const productsArr = products.filter(prod => prod._id.toString() === data[x].item_id);
					// console.log('productsArr > ', productsArr);
					if (productsArr && productsArr.length) {
						data[x].product = productsArr[0];
					}
				}
				temp.push(data[x]);
			}
			return callback(null, {
				success: true,
				data: temp
			});
		});
	});
};

const addCartItem = (req, callback) => {
	const { cart_id } = req.params;
	req.body.order_id = cart_id;
	return addOrderDetails(req, callback);
};

const modifyCartItem = (req, callback) => {
	return modifyOrderDetails(req, callback);
}

const deleteCartItem = (req, callback) => {
	return removeOrderDetails(req, callback);
};

module.exports = {
	getCartItems,
	addCartItem,
	modifyCartItem,
	deleteCartItem
};