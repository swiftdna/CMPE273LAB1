const _ = require('underscore');
const Sequelize = require("sequelize");
const { getShopByIDs } = require('./Shops');
const {getSalesCountByItemID} = require('./OrderDetails');
// const { enable } = require('express/lib/application');

const getAllProducts = async (req, res, next) => {
	// console.log('getAllProducts >>>> called');
	const Op = Sequelize.Op;
	const { sortBy, Order, filter, from, to, type, value, enabled } = req.query;
	const conditions = {};
	if (sortBy) {
		conditions.order = [
			[sortBy, Order ? Order.toUpperCase() : 'ASC']
		];
	}
	if (filter === 'price_range') {
		conditions.where = {
			price: {
				[Op.between]: [from, to]
			}
		};
	}
	if (type === 'search') {
		conditions.where = {
			name: {
				[Op.like]: `%${value}%`
			}
		};
	}
	if (type === 'out_of_stock' && enabled === 'false') {
		conditions.where = {
			qty: {
				[Op.gte]: 1
			}
		};
	}
	// console.log('conditions -> ', conditions);
	conditions.raw = true;
	const {models: {product: Product}} = COREAPP;
	try {
		const products = await Product.findAll(conditions);
    	if (products) {
			// get Shop details
			const productIDs = _.unique(_.pluck(products, 'id'));
			const productSalesData = await getSalesCountByItemID(productIDs);
			const sales = {};
			productSalesData.map(prodSales => {
				sales[prodSales.item_id] = prodSales.sales;
			});
			const shopIDs = _.unique(_.pluck(products, 'shop_id'));
			req.query.shopIDs = shopIDs;
			req.model = {};
			return getShopByIDs(req, res, () => {
				const {data} = req.model;
				const shopMap = {};
				data.map(shop => {
					shopMap[shop.id] = shop;
				})
				const tempProds = products.map(prod => {
					prod.shop_details = shopMap[prod.shop_id];
					prod.salesCount = sales[prod.id];
					return prod;
				});
				res.json({
					success: true,
					data: tempProds
				});
			})
    	} else {
    		res.json({
    			success: true,
    			data: []
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getProducts ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const getProducts = async (req, res, next) => {
	const { shop_id, internal } = req.params;
	const {models: {product: Product}} = COREAPP;
	// console.log('getProducts -> shop_id - ', shop_id);
	try {
		const products = await Product.findAll({
	        where: {
	            shop_id: shop_id
	        },
			raw: true
	    });
    	if (products) {
			const productIDs = _.unique(_.pluck(products, 'id'));
			const productSalesData = await getSalesCountByItemID(productIDs);
			const sales = {};
			productSalesData.map(prodSales => {
				sales[prodSales.item_id] = prodSales.sales;
			});
			const tempProds = products.map(prod => {
				prod.salesCount = sales[prod.id];
				return prod;
			});
			if (internal) {
				req.model = {};
				req.model.data = tempProds;
				return next();
			}
    		res.json({
    			success: true,
    			data: tempProds
    		});
    	} else {
    		res.json({
    			success: true,
    			data: [],
    			message: 'Products not found!'
    		});
    	}
    } catch (err) {
    	// console.log('getProducts ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getProductByIDs = async (req, res, next) => {
	const { productIDs } = req.query;
	const { models: {product: Product} } = COREAPP;
	const Op = Sequelize.Op;

	// console.log('getProductByIDs -> productIDs - ', productIDs);
	try {
		const products = await Product.findAll({
	        where: {
	        	id: {
	            	[Op.in]: productIDs
	        	}
	        },
	        raw: true
	    });
    	if (products) {
    		req.model.data = products;
    	} else {
    		req.model.data = [];
    	}
    	return next();
    } catch (err) {
    	// console.log('getProducts ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getProduct = async (req, res, next) => {
	const { item_id } = req.params;
	const {models: {product: Product}} = COREAPP;
	// console.log('getProducts -> item_id - ', item_id);
	try {
		const products = await Product.findOne({
	        where: {
	            id: item_id
	        },
			raw: true
	    });
    	// console.log('products -> ', products);
    	if (products) {
			const shopIDs = [products.shop_id];
			req.query.shopIDs = shopIDs;
			req.model = {};
			return getShopByIDs(req, res, () => {
				const {data} = req.model;
				const shopMap = {};
				data.map(shop => {
					shopMap[shop.id] = shop;
				})
				products.shop_details = shopMap[products.shop_id];
				res.json({
					success: true,
					data: products
				});
			});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Product not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getProducts ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const addProduct = async (req, res, next) => {
	const { body } = req;
	const {models: {product: Product}} = COREAPP;
	// Image upload to be handled
	try {
		const productData = await Product.create(body);
		if (!productData) {
            return res.json({success: false, message: 'Unable to add product'});
        }
        res.json({
        	success: true,
        	message: 'New product added!',
        	data: productData
        });
        return next();
	} catch(err) {
    	// console.log('addProduct ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

const modifyProduct = async (params, callback) => {
	console.log('modifyProduct called with - ', params);
	const { models: { product: Product } } = COREAPP;
	const { id, body } = params;
	try {
		const productData = await Product.findOne({
			where: {
				id
			}
		});
		if (productData && productData.id) {
			// Get products in this order and 
			const updateRes = await productData.update(body);
			return callback(null, updateRes);
		} else {
			return callback('Order not found in the database');
		}
	} catch(err) {
    	// console.log('modifyProduct ERR!! -> ', err);
		if (res.headersSent)
			return;
    	return callback(err);
    }
};

const removeProduct = async (req, res, next) => {
	const { item_id } = req.params;
	const {models: {product: Product}} = COREAPP;
	try {
		const productData = await Product.destroy({
	        where: {
	            id: item_id
	        }
	    });
	    res.json({
        	success: true,
        	message: 'Product removed!',
        	data: productData
        });
        return next();
	} catch(err) {
    	console.log('removeProduct ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

module.exports = {
	getAllProducts,
	getProductByIDs,
	getProducts,
	getProduct,
	addProduct,
	modifyProduct,
	removeProduct
};