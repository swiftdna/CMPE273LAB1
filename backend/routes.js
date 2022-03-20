const express = require('express');
const router = express.Router();
const { getUserDetails, updateUserDetails} = require('./modules/UserProfile');
const { getAllProducts, getProducts, getProduct, addProduct, modifyProduct, removeProduct } = require('./modules/Products');
const { addFavourite, getFavourites, removeFavourite } = require('./modules/Favourites');
const { addShop, getShop, updateShop, getShopByOwner, checkShopNameExists } = require('./modules/Shops');
const { addCategory, getAllCategories, getCategories, removeCategory } = require('./modules/Categories');
const { getOrders, getOrder, getCartOrder, addOrder, removeOrder, modifyOrder } = require('./modules/Orders');
const { getCartItems, addCartItem, modifyCartItem, deleteCartItem } = require('./modules/CartOrders');
const countries = require('./data/countries.json');

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
router.delete('/products', isLoggedIn, removeProduct);

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
router.delete('/cart/:cart_id', isLoggedIn, deleteCartItem);

router.get('/countries', (req, res) => {
  res.json({
    success: true,
    data: countries
  });
});

router.get('/session', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.session) {
    const {passport: {user}} = req.session ? req.session : {};
    console.log('req.session ->> ', req.session);
    res.json({ success: true, isAuthenticated: true, user: {email: user.email, id: user.id, username: user.username} });
  } else {
    res.status(401).json({message: "Not authorized", success: false});
  }
});

function isLoggedIn(req, res, next) {
  // console.log('session -> ', req.session);
  if (req.isAuthenticated && req.isAuthenticated()) {
    // console.log('req.isAuthenticated() ----> ', req.isAuthenticated());
    console.log(req.session.passport);
    console.log(req.session.user);
    return next();
  }
  res.status(401).json({message: "Not authorized to see this page. Please login!", status: 401});
}

module.exports = router;