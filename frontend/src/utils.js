import { productsLoading, handleProductsResponse } from './actions/app-products';
import { profileLoading, handleProfilesResponse } from './actions/app-profile';
import { handleLoginResponse, setToast, handleCountriesResponse } from './actions/app-actions';
import { favouritesLoading, handleFavouritesResponse } from './actions/app-favourites';
import { productDetailsLoading, handleProductDetailsResponse } from './actions/product-details-actions';
import { addCartID, handleCartItemsResponse } from './actions/cart-details-actions';
import { handlePurchasesResponse } from './actions/purchases-actions';
import { handleShopsResponse, handleShopProductsResponse, handleCategoryResponse, handlePublicShopsResponse, handlePublicShopProductsResponse } from './actions/shop-actions';
import gql from 'graphql-tag';
import { print } from 'graphql';

// import { useNavigate } from 'react-router-dom';

import axios from 'axios';

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    const {data, headers} = response;
    if (headers['x-api-tech'] === 'graphql') {
        const {data} = response.data;
        const keys = data ? Object.keys(data) : [];
        let outputData = {};
        if (keys && keys.length) {
            outputData = data[keys[0]];
        } else {
            outputData = {...data};
        }
        // console.log('nw -> ', outputData);
        response.data = outputData;
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export function fetchProducts(dispatch, params = {}) {
    dispatch(productsLoading());
    axios.post(`/graphql`, {
        query: `
            query {
              getAllProducts {
                success
                data {
                  _id
                  name
                  shop_id
                  salesCount
                  photo_url
                  price
                  shop_details {
                    _id
                    name
                  }
                }
              }
            }
        `
    }).then(response => {
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
    axios.post(`/graphql`, {
        query: `
                query getUserDetails($userID: String!) {
                    getUserDetails(user_id: $userID) {
                        success
                        data {
                            _id
                            email
                            password
                            username
                            address1
                            city
                            dob
                            dp_url
                            name
                            state
                        }
                    }
                }
            `,
        variables: {
            userID
        }
    }).then(response => {
        dispatch(handleProfilesResponse(response));
    });
}

export function updateProfile(dispatch, params, callback) {
    if (params._id)
        delete params._id;
    axios.post(`/graphql`, {
        query: `
                mutation updateUserDetails($email: String,
                        $username: String,
                        $address1: String,
                        $city: String,
                        $dob: String,
                        $dp_url: String,
                        $name: String,
                        $state: String
                    ) {
                    updateUserDetails(
                        email: $email,
                        username: $username,
                        address1: $address1,
                        city: $city,
                        dob: $dob,
                        dp_url: $dp_url,
                        name: $name,
                        state: $state
                    ) {
                        success
                        message
                    }
                }
            `,
        variables: params
    }).then(response => {
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
    // axios.put(`/api/kf/users/profile`, params)
}

export function fetchProductDetails(dispatch, id) {
    dispatch(productDetailsLoading());
    axios.post(`/graphql`, {
        query: `
                query getProduct($item_id: String!) {
                    getProduct(item_id: $item_id) {
                        success
                        data {
                            _id
                            name
                            shop_id
                            salesCount
                            photo_url
                            price
                            description
                            qty
                            shop_details {
                                _id
                                name
                            }
                        }
                    }
                }
            `,
        variables: {
            item_id: id
        }
    }).then(response => {
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
                console.log('Registration failure');
                return callback(true);
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
    // axios.get('/api/kf/order/cart')
    axios.post(`/graphql`, {
        query: `
            query {
                getCartOrder {
                    success
                    data {
                        createdAt
                        modifiedAt
                        status
                        total
                        user_id
                        _id
                        insertedId
                    }
                }
            }
        `
    }).then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(addCartID(data.data));
                getCartItems(dispatch, data.data._id || data.data.insertedId);
            }
        });
}

export function getCartItems(dispatch, id) {
    // axios.get(`/api/kf/cart/${id}`)
    axios.post(`/graphql`, {
        query: `
            query getCartItems($cart_id: String!) {
                getCartItems(cart_id: $cart_id) {
                    success
                    data {
                        _id
                        qty
                        price
                        gift,
                        gift_description
                        product {
                            _id
                            name
                            photo_url
                        }
                    }
                }
            }
        `,
        variables: {
            cart_id: id
        }
    }).then(response => {
        dispatch(handleCartItemsResponse(response));
    });
}

export function addItemToCart(dispatch, id, data) {
    // axios.post(`/api/kf/cart/${id}`, data)
    axios.post('/graphql', {
        query: `
            mutation addCartItem(
                    $cart_id: String!,
                    $item_id: String!,
                    $price: String,
                    $qty: Int
                ) {
                addCartItem(
                    cart_id: $cart_id
                    item_id: $item_id
                    qty: $qty
                    price: $price
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            cart_id: id,
            ...data
        }
    }).then(response => {
            const {data} = response;
            if (data.success) {
                dispatch(setToast({ type: 'success', message: 'Item added to the cart!' }));
                //Fetch cart items
                getCartItems(dispatch, id);
            }
        });
}

export function deleteItemInCart(dispatch, id, cartID) {
    // axios.delete(`/api/kf/cart/item/${id}`)
    axios.post(`/graphql`, {
        // deleteCartItem
        query: `
            mutation deleteCartItem(
                $cart_item_id: String!
            ) {
            deleteCartItem(
                cart_item_id: $cart_item_id
            ) {
                success
                message
            }
        }`,
        variables: {
            cart_item_id: id
        }
    })
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
    const {cartID} = data;
    if (cartID) {
        delete data.cartID;
    }
    axios.post('/graphql', {
        query: `
            mutation modifyCartItem(
                    $order_dtl_id: String!,
                    $qty: Int
                ) {
                modifyCartItem(
                    order_dtl_id: $order_dtl_id
                    qty: $qty
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            order_dtl_id: id,
            ...data
        }
    }).then(response => {
            const {data} = response;
            if (data.success) {
                //Fetch cart items
                dispatch(setToast({ type: 'success', message: 'Item updated in the cart!' }));
                getCartItems(dispatch, cartID);
            }
        });
}

export function createOrder(dispatch, id, data, callback) {
    // modifyOrder
    axios.post('/graphql', {
        query: `
            mutation modifyOrder(
                    $order_id: String!,
                    $status: String,
                    $total: Int
                ) {
                modifyOrder(
                    order_id: $order_id
                    status: $status
                    total: $total
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            order_id: id,
            ...data
        }
    }).then(response => {
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
    // getOrders - created graphql API but not changing this because pagination is involved
    axios.get(`/api/kf/orders`, {params})
        .then(response => {
            dispatch(handlePurchasesResponse(response));
        });
}

export function getShopProducts(dispatch, shopID) {
    // axios.get(`/api/kf/products/shop/${shopID}`)
    // getProducts
    axios.post(`/graphql`, {
        query: `
            query getProducts($shop_id: String!) {
                getProducts(shop_id: $shop_id) {
                    success
                    data {
                        category_id
                        createdAt
                        description
                        image_url
                        item_id
                        modifiedAt
                        name
                        photo_url
                        price
                        qty
                        salesCount
                        shop_id
                        _id
                    }
                }
            }
        `,
        variables: {
            shop_id: shopID
        }
    }).then(response => {
            dispatch(handleShopProductsResponse(response));
        });
}

export function getPublicShopProducts(dispatch, shopID) {
    axios.post(`/graphql`, {
        query: `
            query getProducts($shop_id: String!) {
                getProducts(shop_id: $shop_id) {
                    success
                    data {
                        category_id
                        createdAt
                        description
                        image_url
                        item_id
                        modifiedAt
                        name
                        photo_url
                        price
                        qty
                        salesCount
                        shop_id
                        _id
                    }
                }
            }
        `,
        variables: {
            shop_id: shopID
        }
    }).then(response => {
            dispatch(handlePublicShopProductsResponse(response));
        });
}

export function getShopDetails(dispatch) {
    // getShopByOwner
    axios.post(`/graphql`, {
        query: `
            query {
                getShopByOwner {
                    success
                    data {
                        image_url
                        name
                        owner_id
                        totalSales
                        _id
                    }
                }
            }
        `
    }).then(response => {
            dispatch(handleShopsResponse(response));
            // Get products of the shop
            const { data: shopResponseData } = response;
            const { data } = shopResponseData;
            getShopProducts(dispatch, data._id);
        });
}

export function getShopDetailsByShopID(dispatch, shopID) {
    // getShop
    axios.post(`/graphql`, {
        query: `
            query getShop($shop_id: String!) {
                getShop(shop_id: $shop_id) {
                    success
                    data {
                        image_url
                        name
                        owner_id
                        totalSales
                        _id
                    }
                }
            }
        `,
        variables: {
            shop_id: shopID
        }
    }).then(response => {
            dispatch(handlePublicShopsResponse(response));
            // Get products of the shop
            const { data: shopResponseData } = response;
            const { data } = shopResponseData;
            getPublicShopProducts(dispatch, data._id);
        });
}

export function createShop(dispatch, data) {
    // addShop
    // axios.post(`/api/kf/shops`, data)
    axios.post(`/graphql`, {
        query: `
            mutation addShop(
                    $name: String!
                ) {
                addShop(
                    name: $name
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            ...data
        }
    }).then(response => {
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
    axios.post(`/graphql`, {
        query: `
            mutation updateShop(
                    $shop_id: String!,
                    $name: String,
                    $image_url: String
                ) {
                updateShop(
                    name: $name
                    shop_id: $shop_id
                    image_url: $image_url
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            shop_id: id,
            ...data
        }
    }).then(response => {
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
    params.price = params.price ? parseFloat(params.price) : params.price;
    axios.post(`/graphql`, {
        query: `
            mutation addProduct(
                    $category_id: String,
                    $description: String,
                    $image_url: String,
                    $name: String,
                    $photo_url: String,
                    $price: Float,
                    $qty: String,
                    $shop_id: String 
                ) {
                addProduct(
                    category_id: $category_id
                    description: $description
                    image_url: $image_url
                    name: $name
                    photo_url: $photo_url
                    price: $price
                    qty: $qty
                    shop_id: $shop_id
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            ...params
        }
    }).then(response => {
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
    delete params._id;
    //modifyProduct
    // axios.put(`/api/kf/products/${id}`, params)
    axios.post(`/graphql`, {
        query: `
            mutation modifyProduct(
                    $item_id: String!,
                    $name: String,
                    $image_url: String,
                    $description: String,
                    $price: String,
                    $category_id: String,
                    $qty: String,
                    $photo_url: String
                    $shop_id: String
                ) {
                modifyProduct(
                    item_id: $item_id
                    name: $name
                    image_url: $image_url
                    description: $description
                    price: $price
                    category_id: $category_id
                    qty: $qty
                    photo_url: $photo_url
                    shop_id: $shop_id
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            ...params,
            item_id: id
        }
    }).then(response => {
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
    axios.post(`/graphql`, {
        query: `
            query {
                getAllCategories {
                    success
                    data {
                        name
                        shop_id
                        _id
                    }
                }
            }
        `
    }).then(response => {
            dispatch(handleCategoryResponse(response));
        });
}

export function addNewCategory(dispatch, data, callback) {
    // addCategory
    // axios.post(`/api/kf/categories`, data)
    axios.post(`/graphql`, {
        query: `
            mutation addCategory(
                    $shop_id: String!,
                    $name: String!
                ) {
                addCategory(
                    shop_id: $shop_id
                    name: $name
                ) {
                    success
                    message
                }
            }
        `,
        variables: {
            ...data
        }
    }).then(response => {
            const {data} = response;
            if (data.success) {
                // refresh categories
                getProductCategories(dispatch);
                return callback(null, true);
            }
            return callback(false);
        });
}

export function login(dispatch, data) {
    console.log(data);
    axios.post('/graphql', {
        query: `
            query login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    success
                    message
                    user {
                        email
                        id
                        username
                    }
                }
            }
        `,
        variables: data
    }).then(response => {
            dispatch(handleLoginResponse(response));
    });
}