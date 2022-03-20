import {
	ADD_CART_ITEMS,
	LOADING_CART_ITEMS,
	CLEAR_CART_ITEMS,
	ADD_CART_ID,
	FETCH_CART_ITEMS_ERROR
} from '../constants/actionTypes';

function fetchCartItemsSuccess(data) {
   return {
      type: ADD_CART_ITEMS,
      payload: data
   }
}

export function addCartID(data) {
   const {id} = data;
   console.log('data => ', data);
   return {
      type: ADD_CART_ID,
      payload: id
   }
}

function fetchCartItemsFailure(data) {
   return {
      type: FETCH_CART_ITEMS_ERROR,
      payload: data
   }
}

export function cartItemsLoading() {
   return {
      type: LOADING_CART_ITEMS
   }
}

export function handleCartItemsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchCartItemsSuccess(data.data);
   } else {
      return fetchCartItemsFailure({
         message: data.message
      });
   }
}