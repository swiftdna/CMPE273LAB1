const getCategories = async (req, callback) => {
	const { shop_id } = req.params;
	const { db } = COREAPP;
	const Categories = db.collection('categories');
	// console.log('getCategories -> shop_id - ', shop_id);
	try {
		const categories = await Categories.find({
			shop_id: {
				$or: [null, shop_id]
			}
	    }).toArray();
    	// console.log('categories -> ', categories);
    	if (categories) {
    		return callback(null, {
    			success: true,
    			data: categories
    		});
    	} else {
    		return callback(null, {
    			success: true,
    			data: {},
    			message: 'Categories not found!'
    		});
    	}
    } catch (err) {
    	console.log('getCategories ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getAllCategories = async (req, callback) => {
	const { db } = COREAPP;
	const Categories = db.collection('categories');
	try {
		const categories = await Categories.find().toArray();
    	console.log('categories -> ', categories);
    	if (categories) {
    		return callback(null, {
    			success: true,
    			data: categories
    		});
    	} 
    	return callback(null, {
			success: true,
			data: {},
			message: 'Categories not found!'
		});
    } catch (err) {
    	console.log('getCategories ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const addCategory = async (req, callback) => {
	const {body} = req;
	const { db } = COREAPP;
	const Category = db.collection('categories');
	// Shop id and name is mandatory
	try {
		body.createdAt = +new Date;
		body.modifiedAt = +new Date;
		const categoryData = await Category.insertOne(body);
		if (!categoryData) {
            return callback(null, {success: false, message: 'Unable to add category'});
        }
        return callback(null, {
        	success: true,
        	message: 'New category added!',
        	data: categoryData
        });
	} catch(err) {
    	console.log('addCategory ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

const removeCategory = async (req, callback) => {
	const { category_id } = req.params;
	const { db } = COREAPP;
	const Category = db.collection('categories');
	try {
		const categoryData = await Category.remove({
			id: category_id
		});
	    return callback(null, {
        	success: true,
        	message: 'Category removed!',
        	data: categoryData
        });
	} catch(err) {
    	console.log('removeCategory ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

module.exports = {
	addCategory,
	getCategories,
	removeCategory,
	getAllCategories
};