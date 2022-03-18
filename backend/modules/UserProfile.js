const getUserDetails = async (req, res, next) => {
	const { user_id } = req.params;
	const {models: {user_profile: UserProfile}} = COREAPP;
	console.log('getUserDetails -> user_id - ', user_id);
	try {
		const user = await UserProfile.findOne({
	        where: {
	            user_id: user_id
	        }
	    });
    	// console.log('user -> ', user);
    	if (user) {
    		res.json({
    			success: true,
    			data: user
    		});
    	} else {
    		res.json({
    			success: true,
    			data: {},
    			message: 'User not found!'
    		});
    	}
    	return next();
    } catch (err) {
    	console.log('getUserDetails ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
	}
};

const updateUserDetails = async (req, res, next) => {
	// const { user_id } = req.params;
	const { passport: {user: {id: user_id}} } = req.session;
	const { body } = req;
	const {models: {user_profile: UserProfile, user: User}} = COREAPP;
	// Image upload to be handled
	// console.log('updateUserDetails -> user_id - ', user_id);
	try {
		const userData = await User.findOne({
			where: {
				id: user_id
			}
		});
		if (userData && userData.id) {
			const userProfileData = await UserProfile.findOne({
		        where: {
		            user_id: user_id
		        }
		    });
		    if (userProfileData) {
	    		userProfileData.update(body);
	    		res.json({
                	success: true,
                	message: 'Update successful!'
                });
	    		return next();
	    	} else {
	    		const newUserProfile = await UserProfile.create({...body, user_id});
                if (!newUserProfile) {
                    return res.json({success: false, message: 'error during update'});
                }
                res.json({
                	success: true,
                	message: 'Update successful!',
                	data: newUserProfile
                });
                return next();
	    	}
		} else {
			throw new Error('User not found in the database');
		}
	} catch(err) {
    	console.log('getUserDetails ERR!! -> ', err);
    	res.json({
	    	success: false,
	    	message: err.message
	    });
		return next();
    }
};

module.exports = {
	getUserDetails,
	updateUserDetails
};