const Sequelize = require("sequelize");

const getShopByOwner = async (req, res, next) => {
	const { passport: {user: {id: user_id}} } = req.session;
	const {models: {shop: Shop}} = COREAPP;
	console.log('getShop -> shop_id - ', user_id);
	try {
		const shop = await Shop.findOne({
	        where: {
	            owner_id: user_id
	        }
	    });
    	if (shop) {
    		res.json({
    			success: true,
    			data: shop
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
	const {models: {shop: Shop}} = COREAPP;
	console.log('getShop -> shop_id - ', shop_name);
	try {
		const shop = await Shop.findOne({
	        where: {
	            name: shop_name
	        }
	    });
    	console.log('shop -> ', shop);
    	if (shop && shop.id) {
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
	const { shopIDs } = req.query;
	const { models: {shop: Shop} } = COREAPP;
	const Op = Sequelize.Op;

	console.log('getShopByIDs -> shopIDs - ', shopIDs);
	try {
		const shops = await Shop.findAll({
	        where: {
	        	id: {
	            	[Op.in]: shopIDs
	        	}
	        },
	        raw: true
	    });
    	if (shops) {
    		req.model.data = shops;
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
	const {models: {shop: Shop}} = COREAPP;
	console.log('getShop -> shop_id - ', shop_id);
	try {
		const shop = await Shop.findOne({
	        where: {
	            id: shop_id
	        }
	    });
    	console.log('shop -> ', shop);
    	if (shop) {
    		res.json({
    			success: true,
    			data: shop
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
	const { passport: {user: {id: user_id}} } = req.session;
	const { body } = req;
	const {models: {shop: Shop}} = COREAPP;
	body.owner_id = user_id;
	// Image upload to be handled
	try {
		const shopData = await Shop.create(body);
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
	const {models: {shop: Shop}} = COREAPP;
	console.log('updateShop -> shop_id - ', shop_id);
	try {
		const shopData = await Shop.findOne({
			where: {
				id: shop_id
			}
		});
	    if (shopData) {
    		shopData.update(body);
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