const Sequelize = require("sequelize");

const getCategories = async (req, res, next) => {
	const { shop_id } = req.params;
	const Op = Sequelize.Op;
	const {models: {category: Category}} = COREAPP;
	console.log('getCategories -> shop_id - ', shop_id);
	try {
		const categories = await Category.findAll({
	        where: {
	            shop_id: {
					[Op.or]: [null, shop_id]
				}
	        },
			raw: true
	    });
    	console.log('categories -> ', categories);
    	if (categories) {
    		res.json({
    			success: true,
    			data: categories
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Categories not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getCategories ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const getAllCategories = async (req, res, next) => {
	const {models: {category: Category}} = COREAPP;
	try {
		const categories = await Category.findAll();
    	console.log('categories -> ', categories);
    	if (categories) {
    		res.json({
    			success: true,
    			data: categories
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Categories not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getCategories ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const addCategory = async (req, res, next) => {
	const {body} = req;
	const {models: {category: Category}} = COREAPP;
	try {
		const categoryData = await Category.create(body);
		if (!categoryData) {
            return res.json({success: false, message: 'Unable to add category'});
        }
        res.json({
        	success: true,
        	message: 'New category added!',
        	data: categoryData
        });
        return next();
	} catch(err) {
    	console.log('addCategory ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

const removeCategory = async (req, res, next) => {
	const { category_id } = req.params;
	const {models: {category: Category}} = COREAPP;
	try {
		const categoryData = await Category.destroy({
	        where: {
	            id: category_id
	        }
	    });
	    res.json({
        	success: true,
        	message: 'Category removed!',
        	data: categoryData
        });
        return next();
	} catch(err) {
    	console.log('removeCategory ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

module.exports = {
	addCategory,
	getCategories,
	removeCategory,
	getAllCategories
};