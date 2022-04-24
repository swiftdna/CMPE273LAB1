const { getUserDetails, updateUserDetails} = require('../modules/UserProfile');
const { getAllProducts, getProducts, getProduct, addProduct, modifyProduct, removeProduct } = require('../modules/Products');
const { addFavourite, getAllFavourites, getFavourites, removeFavourite } = require('../modules/Favourites');
const { addShop, getShop, updateShop, checkShopNameExists, getShopByOwner } = require('../modules/Shops');
const { addCategory, getAllCategories, getCategories, removeCategory } = require('../modules/Categories');
const { getOrders, getOrder, getCartOrder, addOrder, removeOrder, modifyOrder } = require('../modules/Orders');
const { getCartItems, addCartItem, modifyCartItem, deleteCartItem } = require('../modules/CartOrders');

const routeHandler = {
  getUserDetails, updateUserDetails,
  getAllProducts, getProducts, getProduct, addProduct, modifyProduct, removeProduct,
  addFavourite, getAllFavourites, getFavourites, removeFavourite,
  addShop, getShop, updateShop, checkShopNameExists, getShopByOwner,
  addCategory, getAllCategories, getCategories, removeCategory,
  getOrders, getOrder, getCartOrder, addOrder, removeOrder, modifyOrder,
  getCartItems, addCartItem, modifyCartItem, deleteCartItem
};

function handle_request(msg, callback){
   
    console.log(">>>> Before profile kafka backend >>>>");
    const { rid } = msg;
    console.log('>>>> msg >>>>', msg);
    console.log('rid -> ', rid);

    return routeHandler[rid](msg, callback);
};

exports.handle_request = handle_request;


