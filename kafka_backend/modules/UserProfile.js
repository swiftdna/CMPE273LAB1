const {ObjectId} = require('mongodb');

const getUserDetails = async (req, callback) => {
	const { user_id } = req.params;
	const { db } = COREAPP;
	const users = db.collection('users');
	console.log('getUserDetails -> user_id - ', user_id);
	try {
		const user = await users.findOne({
	    	_id: ObjectId(user_id)
	    });
    	// console.log('user -> ', user);
    	return callback(null, {
			success: true,
			data: user
		});
    } catch (err) {
    	console.log('getUserDetails ERR!! -> ', err);
    	return callback({
	    	success: false,
	    	message: err.message
	    });
	}
};

const updateUserDetails = async (req, callback) => {
	// const { user_id } = req.params;
	const { user: {_id: user_id}} = req;
	const { body } = req;
	const { db } = COREAPP;
	const users = db.collection('users');
	// Image upload to be handled
	// console.log('updateUserDetails -> user_id - ', user_id);
	try {
		const userData = await users.findOne({
			_id: ObjectId(user_id)
		});
		if (userData && userData._id) {
			const userProfileData = await users.findOne({
		        _id: ObjectId(user_id)
		    });
		    if (userProfileData) {
				body.modifiedAt = +new Date;
	    		await users.updateOne({
					_id: ObjectId(user_id)
				}, {
					$set: body
				});
	    		return callback(null, {
                	success: true,
                	message: 'Update successful!'
                });
	    	} else {
                return callback(null, {
                	success: true,
                	message: 'Update failed. User doesnt exist!'
                });
	    	}
		} else {
			throw new Error('User not found in the database');
		}
	} catch(err) {
    	console.log('getUserDetails ERR!! -> ', err);
    	return callback(null, {
	    	success: false,
	    	message: err.message
	    });
    }
};

module.exports = {
	getUserDetails,
	updateUserDetails
};