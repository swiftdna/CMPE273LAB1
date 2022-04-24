const _ = require('underscore');
const {ObjectId} = require('mongodb');
// const Sequelize = require("sequelize");
const { getShopByIDs } = require('./Shops');
const {getSalesCountByItemID} = require('./OrderDetails');
// const { enable } = require('express/lib/application');

const getAllProducts = async (req, callback) => {
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
		const productsData = await products.find(conditions).sort(sortingObj).toArray();
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
			return getShopByIDs(req, (err, shopResponse) => {
				const shopMap = {};
				shopResponse.map(shop => {
					shopMap[shop._id] = shop;
				})
				const tempProds = productsData.map(prod => {
					prod.shop_details = shopMap[prod.shop_id];
					prod.salesCount = sales[prod._id.toString()];
					return prod;
				});
				return callback(null, {
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
    } catch (err) {
    	console.log('getProducts ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getProducts = async (req, callback) => {
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
				sales[prodSales._id] = prodSales.sales;
			});
			const tempProds = products.map(prod => {
				prod.salesCount = sales[prod._id.toString()];
				return prod;
			});
			// if (internal) {
			// 	req.model = {};
			// 	req.model.data = tempProds;
			// 	return next();
			// }
    		return callback(null, {
    			success: true,
    			data: tempProds
    		});
    	} else {
    		return callback(null, {
    			success: true,
    			data: [],
    			message: 'Products not found!'
    		});
    	}
    } catch (err) {
    	// console.log('getProducts ERR!! -> ', err);
    	return callback(null, {
	    	success: false,
	    	message: err.message
	    });
	}
};

const getProductByIDs = async (req, callback) => {
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
    	return callback(null, productsData);
    } catch (err) {
    	// console.log('getProducts ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getProduct = async (req, callback) => {
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
			return getShopByIDs(req, (err, shopsData) => {
				const shopMap = {};
				shopsData.map(shop => {
					shopMap[shop.id] = shop;
				})
				productsData.shop_details = shopMap[productsData.shop_id];
				return callback(null, {
					success: true,
					data: productsData
				});
			});
    	} else {
    		return callback(null, {
    			success: true,
    			data: {},
    			message: 'Product not found!'
    		});
    	}
    } catch (err) {
    	console.log('getProducts ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const addProduct = async (req, callback) => {
	const { body } = req;
	const {db} = COREAPP;
	const products = db.collection('products');
	// Image upload to be handled
	try {
		body.createdAt = +new Date;
		body.modifiedAt = +new Date;
		const productData = await products.insertOne(body);
		if (!productData) {
            return callback({success: false, message: 'Unable to add product'});
        }
        return callback(null, {
        	success: true,
        	message: 'New product added!',
        	data: productData
        });
	} catch(err) {
    	// console.log('addProduct ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

const modifyProduct = async (params, callback) => {
	console.log('modifyProduct called with - ', params);
	const { db } = COREAPP;
	const product = db.collection('products');
	let { item_id: id, body } = params;
	if (!id && params.rid) {
		// Kafka scenario
		id = params.params.item_id;
	}
	if (body && body._id) {
		delete body._id;
	}
	try {
		const productData = await product.findOne({
			_id: ObjectId(id)
		});
		if (productData && productData._id) {
			// Get products in this order and 
			body.modifiedAt = +new Date;
			const updateRes = await product.updateOne({
				_id: ObjectId(id)
			}, { $set: body });
			console.log('success -> ', updateRes);
			return callback(null, {
				success: true,
				data: updateRes
			});
		} else {
			return callback({
				success: false,
				message: 'Order not found in the database'
			});
		}
	} catch(err) {
    	// console.log('modifyProduct ERR!! -> ', err);
		// if (res.headersSent)
		// 	return;
    	return callback({
			success: false,
			message: err.message
		});
    }
};

const removeProduct = async (req, callback) => {
	const { item_id } = req.params;
	const { db } = COREAPP;
	const products = db.collection('products');

	try {
		const productData = await products.deleteOne({
			_id: ObjectId(item_id)
		});
	    return callback(null, {
        	success: true,
        	message: 'Product removed!',
        	data: productData
        });
	} catch(err) {
    	console.log('removeProduct ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
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