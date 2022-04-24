const express = require('express');
const passport = require('passport');
const router = express.Router();
const { getUserDetails, updateUserDetails} = require('./modules/UserProfile');
const { getAllProducts, getProducts, getProduct, addProduct, modifyProduct, removeProduct } = require('./modules/Products');
const { addFavourite, getAllFavourites, getFavourites, removeFavourite } = require('./modules/Favourites');
const { addShop, getShop, updateShop, checkShopNameExists, getShopByOwner } = require('./modules/Shops');
const { addCategory, getAllCategories, getCategories, removeCategory } = require('./modules/Categories');
const { getOrders, getOrder, getCartOrder, addOrder, removeOrder, modifyOrder } = require('./modules/Orders');
const { getCartItems, addCartItem, modifyCartItem, deleteCartItem } = require('./modules/CartOrders');
const countries = require('./data/countries.json');

const kakfafy = (rid, req, res) => {
  const kafka = require('./kafka/client');
  const {user, params, query, body} = req;
  const modifiedRequest = { rid, user, params, query, body };
  return kafka.make_request('etsy_backend_processing', modifiedRequest, (err,results) => {
    if (err){
      console.log("Inside err");
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

router.get('/', isLoggedIn, (req, res) => {
	res.json({success: true, message: 'Welcome to API page!'});
});

router.get('/users/:user_id', isLoggedIn, getUserDetails);
router.put('/users/profile', isLoggedIn, updateUserDetails);

router.get('/products', getAllProducts);
router.get('/products/shop/:shop_id', getProducts);
router.get('/products/:item_id', getProduct);
router.put('/products/:item_id', isLoggedIn, (req, res) => {
  const {params: {item_id}, body} = req;
  // modifyProduct
  modifyProduct({id: item_id, body}, (err, results) => {
    if (!err) {
      res.json({ success: true,  data: results });
    }
    res.json({success: false, err});
  });
});
router.post('/products', isLoggedIn, addProduct);
router.delete('/products/:item_id', isLoggedIn, removeProduct);

router.get('/favourites', getAllFavourites);
router.get('/favourites/:user_id', isLoggedIn, getFavourites);
router.post('/favourites/:user_id/:item_id', isLoggedIn, addFavourite);
router.delete('/favourites/:user_id/:item_id', isLoggedIn, removeFavourite);

router.get('/categories', isLoggedIn, getAllCategories);
router.get('/categories/:shop_id', isLoggedIn, getCategories);
router.post('/categories', isLoggedIn, addCategory);
router.delete('/categories/:category_id', isLoggedIn, removeCategory);

router.get('/shops', isLoggedIn, getShopByOwner);
router.get('/shops/:shop_id', isLoggedIn, getShop);
router.get('/shops/check/:shop_name', isLoggedIn, checkShopNameExists);
router.post('/shops', isLoggedIn, addShop);
router.put('/shops/:shop_id', isLoggedIn, updateShop);

router.get('/orders', isLoggedIn, getOrders);
router.get('/orders/:order_id', isLoggedIn, getOrder);
router.put('/orders/:order_id', isLoggedIn, modifyOrder);
router.post('/orders', isLoggedIn, addOrder);
router.delete('/orders/:order_id', isLoggedIn, removeOrder);

router.get('/order/cart', isLoggedIn, getCartOrder);
router.get('/cart/:cart_id', isLoggedIn, getCartItems, (req, res) => {
  res.json(req.model.data);
});
router.post('/cart/:cart_id', isLoggedIn, addCartItem);
router.put('/cart/:order_dtl_id', isLoggedIn, modifyCartItem);
// router.delete('/cart/:cart_id', isLoggedIn, deleteCartItem);
router.delete('/cart/item/:cart_item_id', isLoggedIn, deleteCartItem);

// Kafka routes
router.get('/kf/users/:user_id', isLoggedIn, (req, res) => {
  return kakfafy('getUserDetails', req, res);
});
router.put('/kf/users/profile', isLoggedIn, (req, res) => {
  return kakfafy('updateUserDetails', req, res);
});
router.get('/kf/products',  (req, res) => {
  return kakfafy('getAllProducts', req, res);
});
router.get('/kf/products/shop/:shop_id', (req, res) => {
  return kakfafy('getProducts', req, res);
});
router.get('/kf/products/:item_id', (req, res) => {
  return kakfafy('getProduct', req, res);
});
router.put('/kf/products/:item_id', isLoggedIn, (req, res) => {
  return kakfafy('modifyProduct', req, res);
});
router.post('/kf/products', isLoggedIn, (req, res) => {
  return kakfafy('addProduct', req, res);
});
router.delete('/kf/products/:item_id', isLoggedIn, (req, res) => {
  return kakfafy('removeProduct', req, res);
});
router.get('/kf/favourites', (req, res) => {
  return kakfafy('getAllFavourites', req, res);
});
router.get('/kf/favourites/:user_id', isLoggedIn, (req, res) => {
  return kakfafy('getFavourites', req, res);
});
router.post('/kf/favourites/:user_id/:item_id', isLoggedIn, (req, res) => {
  return kakfafy('addFavourite', req, res);
});
router.delete('/kf/favourites/:user_id/:item_id', isLoggedIn, (req, res) => {
  return kakfafy('removeFavourite', req, res);
});
router.get('/kf/categories', isLoggedIn, (req, res) => {
  return kakfafy('getAllCategories', req, res);
});
router.get('/kf/categories/:shop_id', isLoggedIn, (req, res) => {
  return kakfafy('getCategories', req, res);
});
router.post('/kf/categories', isLoggedIn, (req, res) => {
  return kakfafy('addCategory', req, res);
});
router.delete('/kf/categories/:category_id', isLoggedIn, (req, res) => {
  return kakfafy('removeCategory', req, res);
});

router.get('/kf/shops', isLoggedIn, (req, res) => {
  return kakfafy('getShopByOwner', req, res);
});
router.get('/kf/shops/:shop_id', isLoggedIn, (req, res) => {
  return kakfafy('getShop', req, res);
});
router.get('/kf/shops/check/:shop_name', isLoggedIn, (req, res) => {
  return kakfafy('checkShopNameExists', req, res);
});
router.post('/kf/shops', isLoggedIn, (req, res) => {
  return kakfafy('addShop', req, res);
});
router.put('/kf/shops/:shop_id', isLoggedIn, (req, res) => {
  return kakfafy('updateShop', req, res);
});

router.get('/kf/orders', isLoggedIn, (req, res) => {
  return kakfafy('getOrders', req, res);
});
router.get('/kf/orders/:order_id', isLoggedIn, (req, res) => {
  return kakfafy('getOrder', req, res);
});
router.put('/kf/orders/:order_id', isLoggedIn, (req, res) => {
  return kakfafy('modifyOrder', req, res);
});
router.post('/kf/orders', isLoggedIn, (req, res) => {
  return kakfafy('addOrder', req, res);
});
router.delete('/kf/orders/:order_id', isLoggedIn, (req, res) => {
  return kakfafy('removeOrder', req, res);
});

router.get('/kf/order/cart', isLoggedIn, (req, res) => {
  return kakfafy('getCartOrder', req, res);
});
router.get('/kf/cart/:cart_id', isLoggedIn, (req, res) => {
  return kakfafy('getCartItems', req, res);
});
router.post('/kf/cart/:cart_id', isLoggedIn, (req, res) => {
  return kakfafy('addCartItem', req, res);
});
router.put('/kf/cart/:order_dtl_id', isLoggedIn, (req, res) => {
  return kakfafy('modifyCartItem', req, res);
});
// router.delete('/cart/:cart_id', isLoggedIn, deleteCartItem);
router.delete('/kf/cart/item/:cart_item_id', isLoggedIn, (req, res) => {
  return kakfafy('deleteCartItem', req, res);
});

router.get('/countries', (req, res) => {
  res.json({
    success: true,
    data: countries
  });
});

// router.get('/favs', (req, res) => {
//   // const mysqlConnection = require('./config/mysql_native');
//   const mysql = require('mysql');
//   const dbConfig = require("./config/mysql");
//   const connection = mysql.createConnection({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB
//   });

//   connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to MySQL Server!');
//     connection.query('SELECT * from favourites', (err, rows) => {
//       if(err) throw err;
//       // mysqlConnection.destroy();
//       res.json({success: true, data: rows});
//       connection.destroy();
//     });
//   });
// });

router.get('/session', isLoggedIn, async (req, res, next) => {
  if (req.user) {
    const {user} = req;
    res.json({ success: true, isAuthenticated: true, user: {email: user.email, id: user._id, username: user.username} });
  } else {
    res.status(401).json({message: "Not authorized", success: false});
  }
});

async function isLoggedIn(req, res, next) {
  const {etsy_token} = req.cookies;
  req.headers.authorization = `Bearer ${etsy_token}`;
  return passport.authenticate('jwt', {session: false}, async (err, user) => {
    if (process.env.NODE_ENV === 'test') {
      // for testing only
      return next();
    }
    if (user && user._id) {
      req.user = user;
      return next();
    }
    res.status(401).json({message: "Not authorized to see this page. Please login!", status: 401});
  })(req, res, next);
}

module.exports = router;