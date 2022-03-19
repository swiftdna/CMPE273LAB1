import {
   ADD_PRODUCTS,
   LOADING_PRODUCTS,
   CLEAR_PRODUCTS,
   FETCH_PRODUCTS_ERROR
} from '../constants/actionTypes';

function fetchProductSuccess(data) {
   return {
      type: ADD_PRODUCTS,
      payload: data
   }
}

function fetchProductFailure(data) {
   return {
      type: FETCH_PRODUCTS_ERROR,
      payload: data
   }
}

export function productsLoading() {
   return {
      type: LOADING_PRODUCTS
   }
}

export function handleProductsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchProductSuccess(data.data);
   } else {
      return fetchProductFailure({
         message: data.message
      });
   }
}