import { productsLoading, handleProductsResponse } from './actions/app-products';
import { profileLoading, handleProfilesResponse } from './actions/app-profile';
import { handleLoginResponse, setToast } from './actions/app-actions';
import { favouritesLoading, handleFavouritesResponse } from './actions/app-favourites';
import { productDetailsLoading, handleProductDetailsResponse } from './actions/product-details-actions';
import { addCartID, handleCartItemsResponse } from './actions/cart-details-actions';
import { handlePurchasesResponse } from './actions/purchases-actions';

// import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export function fetchProducts(dispatch) {
    dispatch(productsLoading());
    axios.get('/api/products')
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
    const {id: userID} = userObj;
    axios.post(`/api/favourites/${userID}/${id}`)
        .then(response => {
            console.log('fav response ', response);
            fetchFavourites(dispatch, userObj);
        });
}

export function unfavourite(dispatch, id, userObj) {
    console.log('mark fav => ', id);
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

export function getPurchases(dispatch) {
    axios.get(`/api/orders`)
        .then(response => {
            dispatch(handlePurchasesResponse(response));
        });
}