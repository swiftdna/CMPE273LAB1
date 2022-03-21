const getAllFavourites = async (req, res, next) => {
	const {models: {favourite: Favourite}} = COREAPP;
	try {
		const favourites = await Favourite.findAll({});
    	console.log('favourites -> ', favourites);
    	if (favourites) {
    		res.json({
    			success: true,
    			data: favourites
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Favourites not found!'
    		});
    	}
    } catch (err) {
    	console.log('getAllFavourites ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
	}
};

const getFavourites = async (req, res, next) => {
	const { user_id } = req.params;
	const {models: {favourite: Favourite}} = COREAPP;
	console.log('getFavourites -> user_id - ', user_id);
	try {
		const favourites = await Favourite.findAll({
	        where: {
	            user_id: user_id
	        }
	    });
    	console.log('favourites -> ', favourites);
    	if (favourites) {
    		res.json({
    			success: true,
    			data: favourites
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'Favourites not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getFavourites ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const addFavourite = async (req, res, next) => {
	const { user_id, item_id } = req.params;
	const {models: {favourite: Favourite}} = COREAPP;
	console.log('user_id, item_id >>>> ', user_id, item_id);
	try {
		const favouriteData = await Favourite.create({ user_id, item_id });
		if (!favouriteData) {
            return res.json({success: false, message: 'Unable to add favourite'});
        }
        res.json({
        	success: true,
        	message: 'New favourite added!',
        	data: favouriteData
        });
        return next();
	} catch(err) {
    	console.log('addFavourite ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

const removeFavourite = async (req, res, next) => {
	const { user_id, item_id } = req.params;
	const { models: { favourite: Favourite } } = COREAPP;
	try {
		const favouriteData = await Favourite.destroy({
	        where: {
	            user_id,
	            item_id
	        }
	    });
	    res.json({
        	success: true,
        	message: 'Favourite removed!',
        	data: favouriteData
        });
	} catch(err) {
    	console.log('removeFavourite ERR!! -> ', err);
    	res.json({
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