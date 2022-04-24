const getAllFavourites = async (req, callback) => {
	const {db} = COREAPP;
	const Favourite = db.collection('favourites');
	try {
		const favourites = await Favourite.find({}).toArray();
    	console.log('favourites -> ', favourites);
    	if (favourites) {
    		return callback(null, {
    			success: true,
    			data: favourites
    		});
    	}
		return callback(null, {
			success: true,
			data: {},
			message: 'Favourites not found!'
		});
    } catch (err) {
    	console.log('getAllFavourites ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getFavourites = async (req, callback) => {
	const { user_id } = req.params;
	const {db} = COREAPP;
	const Favourite = db.collection('favourites');
	console.log('getFavourites -> user_id - ', user_id);
	try {
		const favourites = await Favourite.find({
	        user_id: user_id
	    }).toArray();
    	console.log('favourites -> ', favourites);
    	if (favourites) {
    		return callback(null, {
    			success: true,
    			data: favourites
    		});
    	}
		return callback(null, {
			success: true,
			data: {},
			message: 'Favourites not found!'
		});
    } catch (err) {
    	console.log('getFavourites ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const addFavourite = async (req, callback) => {
	const { user_id, item_id } = req.params;
	const {db} = COREAPP;
	const Favourite = db.collection('favourites');
	console.log('user_id, item_id >>>> ', user_id, item_id);
	try {
		const favouriteData = await Favourite.insertOne({ user_id, item_id, createdAt: +new Date, modifiedAt: +new Date });
		if (!favouriteData) {
            return callback(null, {success: false, message: 'Unable to add favourite'});
        }
        return callback(null, {
        	success: true,
        	message: 'New favourite added!',
        	data: favouriteData
        });
	} catch(err) {
    	console.log('addFavourite ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

const removeFavourite = async (req, callback) => {
	const { user_id, item_id } = req.params;
	const {db} = COREAPP;
	const Favourite = db.collection('favourites');
	try {
		const favouriteData = await Favourite.remove({
			user_id,
			item_id
	    });
	    return callback(null, {
        	success: true,
        	message: 'Favourite removed!',
        	data: favouriteData
        });
	} catch(err) {
    	console.log('removeFavourite ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
    }
};

module.exports = {
	addFavourite,
	getAllFavourites,
	getFavourites,
	removeFavourite
};