import { productsLoading, handleProductsResponse } from './actions/app-products';
import { profileLoading, handleProfilesResponse } from './actions/app-profile';
import { handleLoginResponse, setToast, handleCountriesResponse } from './actions/app-actions';
import { favouritesLoading, handleFavouritesResponse } from './actions/app-favourites';
import { productDetailsLoading, handleProductDetailsResponse } from './actions/product-details-actions';
import { addCartID, handleCartItemsResponse } from './actions/cart-details-actions';
import { handlePurchasesResponse } from './actions/purchases-actions';
import { handleShopsResponse, handleShopProductsResponse, handleCategoryResponse, handlePublicShopsResponse, handlePublicShopProductsResponse } from './actions/shop-actions';

// import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export function fetchProducts(dispatch, params = {}) {
    dispatch(productsLoading());
    axios.get('/api/kf/products', { params })
        .then(response => {
            dispatch(handleProductsResponse(response));
        });
}

export function fetchFavourites (dispatch, userObj) {
    dispatch(favouritesLoading());
    const {id: userID} = userObj;
    axios.get(`/api/kf/favourites/${userID}`)
        .then(response => {
            dispatch(handleFavouritesResponse(response));
        });
}

export function favourite(dispatch, id, userObj) {
    console.log('mark fav => ', id);
    dispatch(favouritesLoading());
    const {id: userID} = userObj;
    axios.post(`/api/kf/favourites/${userID}/${id}`)
        .then(response => {
            console.log('fav response ', response);
            fetchFavourites(dispatch, userObj);
        });
}

export function unfavourite(dispatch, id, userObj) {
    console.log('mark fav => ', id);
    dispatch(favouritesLoading());
    const {id: userID} = userObj;
    axios.delete(`/api/kf/favourites/${userID}/${id}`)
        .then(response => {
            console.log('fav response ', response);
            fetchFavourites(dispatch, userObj);
        });
}

export function fetchProfile(dispatch, userObj) {
    const {id: userID} = userObj;
    dispatch(profileLoading());
    axios.get(`/api/kf/users/${userID}`)
        .then(response => {
            dispatch(handleProfilesResponse(response));
        });
}

export function updateProfile(dispatch, params, callback) {
    if (params._id)
        delete params._id;
    axios.put(`/api/kf/users/profile`, params)
        .then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(setToast({
                    type: 'success',
                    message: 'User profile updated successfully!'
                }));
                return callback(null, true);
            } else {
                return callback(true);
            }
        });
}

export function fetchProductDetails(dispatch, id) {
    dispatch(productDetailsLoading());
    axios.get(`/api/kf/products/${id}`)
        .then(response => {
            dispatch(handleProductDetailsResponse(response));
        });
}

export function register(dispatch, data, callback) {
    // const navigate = useNavigate();
    // dispatch(profileLoading());
    axios.post(`/signup`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                console.log('Registration success');
                return callback(null, true);
                // navigate('login');
            } else {
                return callback(true);
                console.log('Registration failure');
            }
        });
}

export function checkSession(dispatch) {
    axios.get('/api/session')
        .then(response => {
            dispatch(handleLoginResponse(response));
        })
        .catch(err => {
            // console.log(err.message);
        });
}

export function getCartID(dispatch) {
    axios.get('/api/kf/order/cart')
        .then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(addCartID(data.data));
                getCartItems(dispatch, data.data._id || data.data.insertedId);
            }
        });
}

export function getCartItems(dispatch, id) {
    // console.log(id);
    axios.get(`/api/kf/cart/${id}`)
        .then(response => {
            dispatch(handleCartItemsResponse(response));
        });
}

export function addItemToCart(dispatch, id, data) {
    axios.post(`/api/kf/cart/${id}`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(setToast({ type: 'success', message: 'Item added to the cart!' }));
                //Fetch cart items
                getCartItems(dispatch, id);
            }
        });
}

export function deleteItemInCart(dispatch, id, cartID) {
    axios.delete(`/api/kf/cart/item/${id}`)
        .then(response => {
            const {data} = response;
            if (data.success) {
                //Fetch cart items
                dispatch(setToast({ type: 'success', message: 'Item removed from the cart!' }));
                getCartItems(dispatch, cartID);
            }
        });
}

export function updatedItemInCart(dispatch, id, data) {
    axios.put(`/api/kf/cart/${id}`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                //Fetch cart items
                dispatch(setToast({ type: 'success', message: 'Item updated in the cart!' }));
                getCartItems(dispatch, data.cartID);
            }
        });
}

export function createOrder(dispatch, id, data, callback) {
    axios.put(`/api/kf/orders/${id}`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                // Post message to UI
                dispatch(setToast({
                    type: 'success',
                    message: 'Order placed successfully!'
                }));
                getCartID(dispatch);
                return callback(null, true);
            }
            return callback(null, false);
        })
}

export function getPurchases(dispatch, params = {}) {
    axios.get(`/api/kf/orders`, {params})
        .then(response => {
            dispatch(handlePurchasesResponse(response));
        });
}

export function getShopProducts(dispatch, shopID) {
    axios.get(`/api/kf/products/shop/${shopID}`)
        .then(response => {
            dispatch(handleShopProductsResponse(response));
        });
}

export function getPublicShopProducts(dispatch, shopID) {
    axios.get(`/api/kf/products/shop/${shopID}`)
        .then(response => {
            dispatch(handlePublicShopProductsResponse(response));
        });
}

export function getShopDetails(dispatch) {
    axios.get(`/api/kf/shops`)
        .then(response => {
            dispatch(handleShopsResponse(response));
            // Get products of the shop
            const { data: shopResponseData } = response;
            const { data } = shopResponseData;
            getShopProducts(dispatch, data._id);
        });
}

export function getShopDetailsByShopID(dispatch, shopID) {
    axios.get(`/api/kf/shops/${shopID}`)
        .then(response => {
            dispatch(handlePublicShopsResponse(response));
            // Get products of the shop
            const { data: shopResponseData } = response;
            const { data } = shopResponseData;
            getPublicShopProducts(dispatch, data._id);
        });
}

export function createShop(dispatch, data) {
    axios.post(`/api/kf/shops`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(setToast({
                    type: 'success',
                    message: 'Shop created successfully!'
                }));
                getShopDetails(dispatch);
            }
        });
}

export function modifyShop(dispatch, id, data, callback) {
    axios.put(`/api/kf/shops/${id}`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                callback(null, true);
                dispatch(setToast({
                    type: 'success',
                    message: 'Shop modified successfully!'
                }));
                getShopDetails(dispatch);
            }
            callback(true);
        });
}

export function addProduct(dispatch, params, callback) {
    axios.post(`/api/kf/products`, params)
        .then(response => {
            const {data} = response;
            if (data.success) {
                callback(null, true);
                dispatch(setToast({
                    type: 'success',
                    message: 'Product added successfully!'
                }));
                getShopProducts(dispatch, params.shop_id);
            }
            callback(true);
        });
}

export function modifyProduct(dispatch, params, callback) {
    const {_id: id} = params;
    delete params.id;
    axios.put(`/api/kf/products/${id}`, params)
        .then(response => {
            const {data} = response;
            if (data.success) {
                callback(null, true);
                dispatch(setToast({
                    type: 'success',
                    message: 'Product modified successfully!'
                }));
                getShopProducts(dispatch, params.shop_id);
            }
            callback(true);
        });
}

export function uploadImageToCloud(dispatch, file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('cloud_name', 'dac0hzhv5')
    formData.append('upload_preset', 'j8gp4zov')

    return axios.post(
      'https://api.cloudinary.com/v1_1/dac0hzhv5/image/upload',
      formData
    );
}

export function getCountries(dispatch) {
    axios.get(`/api/kf/countries`)
        .then(response => {
            dispatch(handleCountriesResponse(response));
        });
}

export function getProductCategories(dispatch) {
    axios.get(`/api/kf/categories`)
        .then(response => {
            dispatch(handleCategoryResponse(response));
        });
}

export function addNewCategory(dispatch, data, callback) {
    axios.post(`/api/kf/categories`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                // refresh categories
                getProductCategories(dispatch);
                return callback(null, true);
            }
            return callback(false);
        });
}