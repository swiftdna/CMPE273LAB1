const passport = require('passport');
const jwtSecret = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const util = require('util');

const kakfafy = (req) => {
	return new Promise((resolve, reject) => {
		const kafka = require('../kafka/client');
		const {user, params, query, body, rid} = req;
		const modifiedRequest = { rid, user, params, query, body };
		console.log('modifiedRequest -> ', modifiedRequest);
		kafka.make_request('etsy_backend_processing', modifiedRequest, (err,results) => {
			if (err){
			  reject(err);
			  return 
			}
			console.log('results -> ', JSON.stringify(results));
			resolve(results);
		});
	});
};

const loginPassport = async (root, args, context) => {
	return new Promise(async (resolve, reject) => {
		const { username, password } = root;
		const { res } = args;
		console.log(username, password);

		const { user, info } = await args.authenticate("graphql-local", {
	        username, password
	    });
	    if (!user) {
	    	resolve({success: false, ...info});
	    	return;
	    }
	    const userObj = {email: user.email, id: user._id, username: user.username};
        const token = jwt.sign(userObj, jwtSecret.secret);
        res.cookie('etsy_token', token, { httpOnly: true });
        resolve({ info, success: true, isAuthenticated: true, user: userObj, token });
	});
}

const isUserLoggedIn = async (root, args, context) => {
	return new Promise(async (resolve, reject) => {
		const {req, res} = args;
	  	const {etsy_token} = req.cookies;
	  	req.headers.authorization = `Bearer ${etsy_token}`;
		const { user } = await args.authenticate('jwt', {session: false});
		if (user && user._id) {
			req.user = user;
			resolve(true);
			return
		}
		resolve(false);
	});
}

const wireup = async (root, args, context, info) => {
	// Wires up graphql to kafkafy methods
	const { fieldName } = context;
	const params = {...root};
	const query = {...root};
	const body = {...root};
	const loginExceptionModules = ['login', 'logout', 'getAllProducts'];
	if (fieldName === 'modifyProduct') {
		delete body.item_id;
	} else if (fieldName === 'updateShop') {
		delete body.shop_id;
	} else if (fieldName === 'modifyOrder') {
		delete body.order_id;
	} else if (fieldName === 'modifyCartItem') {
		delete body.order_dtl_id;
	} else if (fieldName === 'addCartItem') {
		delete body.cart_id
	}
	const req = {
		rid: fieldName,
		params,
		query,
		body
	};
	if (fieldName === 'login') {
		// console.log('context -> ', context.login);
		const loginResp = await loginPassport(root, args, context);
		return loginResp;
	}
	if (fieldName === 'logout') {
		const { req, res } = args;
		await req.session.destroy();
	    // destroy session data
	    req.session = null;
	    res.clearCookie("etsy_token");
	    return { success: true };
	}
	if (loginExceptionModules.indexOf(fieldName) === -1) {
		const loggedIn = await isUserLoggedIn(root, args, context);
		console.log('loggedIn => ', loggedIn);
		if (!loggedIn) {
			return { success: false, message: "Not authorized to see this page. Please login!" };
		}
	}
	req.user = {...args.req.user};
	return kakfafy(req);
};

module.exports = {
	wireup
};