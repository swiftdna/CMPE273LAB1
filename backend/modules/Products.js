const _ = require('underscore');
const {ObjectId} = require('mongodb');
// const Sequelize = require("sequelize");
const { getShopByIDs } = require('./Shops');
const {getSalesCountByItemID} = require('./OrderDetails');
// const { enable } = require('express/lib/application');

const getAllProducts = async (req, res, next) => {
	// console.log('getAllProducts >>>> called');
	const { sortBy, Order, filter, from, to, type, value, enabled } = req.query;
	const sortingObj = {};
	const conditions = {};
	if (sortBy) {
		sortingObj = {
			[sortBy]: Order ? Order.toLowerCase() : 'asc'
		};
	}
	if (filter === 'price_range') {
		conditions.price = {
			$gte: from,
			$lt: to
		};
	}
	if (type === 'search') {
		conditions.name= new RegExp(value, 'i');
	}
	if (type === 'out_of_stock' && enabled === 'false') {
		conditions.qty = {
			$gte: 1
		};
	}
	console.log('conditions -> ', conditions, sortingObj);
	const { db } = COREAPP;
	const products = db.collection('products');
	try {
		// const productsData = await products.find(conditions).sort(sortingObj).toArray();
		const productsData = await products.find({}).toArray();
    	if (productsData) {
			// get Shop details
			const productIDs = _.unique(_.pluck(products, 'id'));
			const productSalesData = await getSalesCountByItemID(productIDs);
			console.log('productSalesData -> ', productSalesData);
			const sales = {};
			productSalesData.map(prodSales => {
				sales[prodSales._id] = prodSales.sales;
			});
			const shopIDs = _.unique(_.pluck(productsData, 'shop_id'));
			req.query.shopIDs = shopIDs;
			req.model = {};
			return getShopByIDs(req, res, () => {
				const {data} = req.model;
				const shopMap = {};
				data.map(shop => {
					shopMap[shop.id] = shop;
				})
				const tempProds = productsData.map(prod => {
					prod.shop_details = shopMap[prod.shop_id];
					prod.salesCount = sales[prod._id.toString()];
					return prod;
				});
				res.json({
					success: true,
					data: tempProds
				});
			});
    	// } else {
    		// res.json({
    		// 	success: true,
    		// 	data: productsData
    		// });
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
	const { db } = COREAPP;
	const Product = db.collection('products');
	// console.log('getProducts -> shop_id - ', shop_id);
	try {
		const products = await Product.find({
			shop_id: shop_id
	    }).toArray();
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
	let { productIDs } = req.query;
	const {db} = COREAPP;
	const products = db.collection('products');

	// console.log('getProductByIDs -> productIDs - ', productIDs);
	productIDs = productIDs.map(prodid => ObjectId(prodid));
	try {
		const productsData = await products.find({
			_id: {
				$in: productIDs
			}
	    }).toArray();
    	if (productsData) {
    		req.model.data = productsData;
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
	const {db} = COREAPP;
	const products = db.collection('products');
	// console.log('getProducts -> item_id - ', item_id);
	try {
		const productsData = await products.findOne({
			_id: ObjectId(item_id)
	    });
    	// console.log('products -> ', products);
    	if (productsData) {
			const shopIDs = [productsData.shop_id];
			req.query.shopIDs = shopIDs;
			req.model = {};
			return getShopByIDs(req, res, () => {
				const {data} = req.model;
				const shopMap = {};
				data.map(shop => {
					shopMap[shop.id] = shop;
				})
				productsData.shop_details = shopMap[productsData.shop_id];
				res.json({
					success: true,
					data: productsData
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
	const {db} = COREAPP;
	const products = db.collection('products');
	// Image upload to be handled
	try {
		const productData = await products.insertOne(body);
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
	const { db } = COREAPP;
	const product = db.collection('products');
	const { id, body } = params;
	try {
		const productData = await product.findOne({
			_id: ObjectId(id)
		});
		if (productData && productData._id) {
			// Get products in this order and 
			const updateRes = await product.updateOne({
				_id: ObjectId(id)
			}, { $set: body });
			return callback(null, updateRes);
		} else {
			return callback('Order not found in the database');
		}
	} catch(err) {
    	// console.log('modifyProduct ERR!! -> ', err);
		// if (res.headersSent)
		// 	return;
    	return callback(err);
    }
};

const removeProduct = async (req, res, next) => {
	const { item_id } = req.params;
	const { db } = COREAPP;
	const products = db.collection('products');

	try {
		const productData = await products.deleteOne({
			_id: ObjectId(item_id)
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