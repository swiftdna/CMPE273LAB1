import {
   ADD_PURCHASES,
   LOADING_PURCHASES,
   CLEAR_PURCHASES,
   FETCH_PURCHASES_ERROR
} from '../constants/actionTypes';

function fetchPurchasesSuccess(data) {
   return {
      type: ADD_PURCHASES,
      payload: data
   }
}

function fetchPurchasesFailure(data) {
   return {
      type: FETCH_PURCHASES_ERROR,
      payload: data
   }
}

export function purchasesLoading() {
   return {
      type: LOADING_PURCHASES
   }
}

export function handlePurchasesResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchPurchasesSuccess(data);
   } else {
      return fetchPurchasesFailure({
         message: data.message
      });
   }
}