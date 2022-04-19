// const Sequelize = require("sequelize");
const {ObjectId} = require('mongodb');

const getShopByOwner = async (req, res, next) => {
	console.log('req -> ', req.user);
	let { user: {_id: user_id} } = req;
	const {db} = COREAPP;
	const Shop = db.collection('shops');
	user_id = user_id.toString();
	console.log('getShop -> shop_id - ', user_id);
	try {
		const shop = await Shop.findOne({
	        owner_id: user_id
	    });
    	if (shop) {
			const {getProducts} = require('./Products');
			req.params.shop_id = shop.id;
			req.params.internal = true;
			return getProducts(req, res, () => {
				const {data} = req.model;
				console.log('data ==> ', data);
				const totalSales = data.reduce((total, item) => {
					return total + (item.salesCount ? Number(item.salesCount) : 0);
				}, 0);
				res.json({
					success: true,
					data: { ...shop, totalSales }
				});
			});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Shop not found!'
    		});
    	}
    } catch (err) {
    	console.log('getShop ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const checkShopNameExists = async (req, res, next) => {
	const { shop_name } = req.params;
	const { db } = COREAPP;
	const shops = db.collection('shops');
	console.log('getShop -> shop_id - ', shop_name);
	try {
		const shop = await shops.findOne({
			name: shop_name
	    });
    	console.log('shop -> ', shop);
    	if (shop && shop._id) {
    		res.json({
    			success: true,
    			data: {
					exist: true
				}
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {
					exist: false
				}
    		});
    	}
    } catch (err) {
    	console.log('getShop ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getShopByIDs = async (req, res, next) => {
	let { shopIDs } = req.query;
	const { db } = COREAPP;
	const shops = db.collection('shops');
	shopIDs = shopIDs.map(shopID => ObjectId(shopID));
	console.log('getShopByIDs -> shopIDs - ', shopIDs);
	try {
		const shopsData = await shops.find({
			_id: {
				$in: shopIDs
			}
	    }).toArray();
    	if (shopsData) {
    		req.model.data = shopsData;
    	} else {
    		req.model.data = [];
    	}
		return next();
    } catch (err) {
    	console.log('getShopByIDs ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getShop = async (req, res, next) => {
	const { shop_id } = req.params;
	const {db} = COREAPP;
	const Shop = db.collection('shops');
	console.log('getShop -> shop_id - ', shop_id);
	try {
		const shop = await Shop.findOne({
	        _id: ObjectId(shop_id)
	    });
    	console.log('shop -> ', shop);
    	if (shop) {
			const {getProducts} = require('./Products');
			// Get shop total sales
			// Get products of the shop
			req.params.shop_id = shop_id;
			req.params.internal = true;
			return getProducts(req, res, () => {
				const {data} = req.model;
				console.log('data ==> ', data);
				const totalSales = data.reduce((total, item) => {
					return total + (item.salesCount ? Number(item.salesCount) : 0);
				}, 0);
				res.json({
					success: true,
					data: {...shop, totalSales: totalSales }
				});
			});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Shop not found!'
    		});
    	}
    } catch (err) {
    	console.log('getShop ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const addShop = async (req, res, next) => {
	const { user: {_id: user_id} } = req;
	const { body } = req;
	const { db } = COREAPP;
	const shops = db.collection('shops');
	body.owner_id = user_id;
	// Image upload to be handled
	try {
		const shopData = await shops.insertOne(body);
		if (!shopData) {
            return res.json({success: false, message: 'Unable to add shop'});
        }
        res.json({
        	success: true,
        	message: 'New shop added!',
        	data: shopData
        });
	} catch(err) {
    	console.log('addShop ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
    }
};

const updateShop = async (req, res, next) => {
	const { shop_id } = req.params;
	const { body } = req;
	const { db } = COREAPP;
	const shops = db.collection('shops');
	console.log('updateShop -> shop_id - ', shop_id);
	try {
		const shopData = await shops.findOne({
			_id: ObjectId(shop_id)
		});
	    if (shopData) {
    		await shops.updateOne({_id: ObjectId(shop_id)}, {$set: body});
    		res.json({
            	success: true,
            	message: 'Update successful!'
            });
    	} else {
    		throw new Error('Shop not found!');
    	}
	} catch(err) {
    	console.log('updateShop ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
    }
};

module.exports = {
	getShopByOwner,
	addShop,
	getShopByIDs,
	getShop,
	updateShop,
	checkShopNameExists
};