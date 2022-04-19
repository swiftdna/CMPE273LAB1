const getCategories = async (req, res, next) => {
	const { shop_id } = req.params;
	const { db } = COREAPP;
	const Categories = db.collection('categories');
	console.log('getCategories -> shop_id - ', shop_id);
	try {
		const categories = await Categories.find({
			shop_id: {
				$or: [null, shop_id]
			}
	    }).toArray();
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
	const { db } = COREAPP;
	const Categories = db.collection('categories');
	try {
		const categories = await Categories.find().toArray();
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
	const { db } = COREAPP;
	const Category = db.collection('categories');
	// Shop id and name is mandatory
	try {
		const categoryData = await Category.insertOne(body);
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
	const { db } = COREAPP;
	const Category = db.collection('categories');
	try {
		const categoryData = await Category.remove({
			id: category_id
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