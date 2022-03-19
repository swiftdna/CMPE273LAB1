const { getOrderDetails, addOrderDetails, modifyOrderDetails } = require('./OrderDetails');
const { getProductByIDs } = require('./Products');
const _ = require('underscore');

const getCartItems = (req, res, next) => {
	const { cart_id } = req.params;
	req.params.order_id = cart_id;
	req.model = {};
	return getOrderDetails(req, res, () => {
		const {data} = req.model.data;
		const productIDs = _.pluck(data, 'item_id');
		req.query = {productIDs};
		const temp = [];
		return getProductByIDs(req, res, () => {
			const products = req.model.data;
			for (let x = 0; x < data.length; x++) {
				console.log('data[x] ===> ', data[x]);
				if (data[x].item_id) {
					data[x].product = {};
					const productsArr = products.filter(prod => prod.id === data[x].item_id);
					console.log('productsArr > ', productsArr);
					if (productsArr && productsArr.length) {
						data[x].product = productsArr[0];
					}
				}
				temp.push(data[x]);
			}
			req.model.data = {
				success: true,
				data: temp
			};
			return next();
		});
	});
};

const addCartItem = (req, res, next) => {
	const { cart_id } = req.params;
	req.body.order_id = cart_id;
	return addOrderDetails(req, res, next);
};

const modifyCartItem = (req, res, next) => {
	return modifyOrderDetails(req, res, next);
}

const deleteCartItem = () => {

};

module.exports = {
	getCartItems,
	addCartItem,
	modifyCartItem,
	deleteCartItem
};