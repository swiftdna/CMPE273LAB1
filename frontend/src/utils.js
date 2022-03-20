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
    axios.get('/api/products', { params })
        .then(response => {
            dispatch(handleProductsResponse(response));
        });
}

export function fetchFavourites (dispatch, userObj) {
    dispatch(favouritesLoading());
    const {id: userID} = userObj;
    axios.get(`/api/favourites/${userID}`)
        .then(response => {
            dispatch(handleFavouritesResponse(response));
        });
}

export function favourite(dispatch, id, userObj) {
    console.log('mark fav => ', id);
    dispatch(favouritesLoading());
    const {id: userID} = userObj;
    axios.post(`/api/favourites/${userID}/${id}`)
        .then(response => {
            console.log('fav response ', response);
            fetchFavourites(dispatch, userObj);
        });
}

export function unfavourite(dispatch, id, userObj) {
    console.log('mark fav => ', id);
    dispatch(favouritesLoading());
    const {id: userID} = userObj;
    axios.delete(`/api/favourites/${userID}/${id}`)
        .then(response => {
            console.log('fav response ', response);
            fetchFavourites(dispatch, userObj);
        });
}

export function fetchProfile(dispatch, userObj) {
    const {id: userID} = userObj;
    dispatch(profileLoading());
    axios.get(`/api/users/${userID}`)
        .then(response => {
            dispatch(handleProfilesResponse(response));
        });
}

export function updateProfile(dispatch, params, callback) {
    if (params.id)
        delete params.id;
    axios.put(`/api/users/profile`, params)
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
    axios.get(`/api/products/${id}`)
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
            console.log(err);
        });
}

export function getCartID(dispatch) {
    axios.get('/api/order/cart')
        .then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(addCartID(data.data));
                getCartItems(dispatch, data.data.id);
            }
        });
}

export function getCartItems(dispatch, id) {
    // console.log(id);
    axios.get(`/api/cart/${id}`)
        .then(response => {
            dispatch(handleCartItemsResponse(response));
        });
}

export function addItemToCart(dispatch, id, data) {
    axios.post(`/api/cart/${id}`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(setToast({ type: 'success', message: 'Item added to the cart!' }));
                //Fetch cart items
                getCartItems(dispatch, id);
            }
        });
}

export function updatedItemInCart(dispatch, id, data) {
    axios.put(`/api/cart/${id}`, data)
        .then(response => {
            const {data} = response;
            if (data.success) {
                //Fetch cart items
                dispatch(setToast({ type: 'success', message: 'Item updated in the cart!' }));
                getCartItems(dispatch, id);
            }
        });
}

export function createOrder(dispatch, id, data, callback) {
    axios.put(`/api/orders/${id}`, data)
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
    axios.get(`/api/orders`, {params})
        .then(response => {
            dispatch(handlePurchasesResponse(response));
        });
}

export function getShopProducts(dispatch, shopID) {
    axios.get(`/api/products/shop/${shopID}`)
        .then(response => {
            dispatch(handleShopProductsResponse(response));
        });
}

export function getPublicShopProducts(dispatch, shopID) {
    axios.get(`/api/products/shop/${shopID}`)
        .then(response => {
            dispatch(handlePublicShopProductsResponse(response));
        });
}

export function getShopDetails(dispatch) {
    axios.get(`/api/shops`)
        .then(response => {
            dispatch(handleShopsResponse(response));
            // Get products of the shop
            const { data: shopResponseData } = response;
            const { data } = shopResponseData;
            getShopProducts(dispatch, data.id);
        });
}

export function getShopDetailsByShopID(dispatch, shopID) {
    axios.get(`/api/shops/${shopID}`)
        .then(response => {
            dispatch(handlePublicShopsResponse(response));
            // Get products of the shop
            const { data: shopResponseData } = response;
            const { data } = shopResponseData;
            getPublicShopProducts(dispatch, data.id);
        });
}

export function createShop(dispatch, data) {
    axios.post(`/api/shops`, data)
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
    axios.put(`/api/shops/${id}`, data)
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
    axios.post(`/api/products`, params)
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
    axios.get(`/api/countries`)
        .then(response => {
            dispatch(handleCountriesResponse(response));
        });
}

export function getProductCategories(dispatch) {
    axios.get(`/api/categories`)
        .then(response => {
            dispatch(handleCategoryResponse(response));
        });
}