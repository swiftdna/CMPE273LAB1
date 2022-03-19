import {
   ADD_PRODUCT_DETAILS,
   LOADING_PRODUCT_DETAILS,
   CLEAR_PRODUCT_DETAILS,
   FETCH_PRODUCT_DETAILS_ERROR
} from '../constants/actionTypes';

function fetchProductDetailsSuccess(data) {
   return {
      type: ADD_PRODUCT_DETAILS,
      payload: data
   }
}

function fetchProductDtlsFailure(data) {
   return {
      type: FETCH_PRODUCT_DETAILS_ERROR,
      payload: data
   }
}

export function productDetailsLoading() {
   return {
      type: LOADING_PRODUCT_DETAILS
   }
}

export function handleProductDetailsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchProductDetailsSuccess(data.data);
   } else {
      return fetchProductDtlsFailure({
         message: data.message
      });
   }
}