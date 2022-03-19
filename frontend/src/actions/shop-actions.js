import {
   ADD_SHOPS,
   ADD_PUBLIC_SHOP,
   LOADING_SHOPS,
   CLEAR_SHOPS,
   FETCH_SHOPS_ERROR,
   ADD_SHOP_PRODUCTS,
   LOADING_SHOP_PRODUCTS,
   CLEAR_SHOP_PRODUCTS,
   ADD_SHOP_CATEGORIES,
   ADD_PUBLIC_SHOP_PRODUCTS
} from '../constants/actionTypes';

function fetchShopsSuccess(data) {
   return {
      type: ADD_SHOPS,
      payload: data
   }
}

function fetchPublicShopsSuccess(data) {
   return {
      type: ADD_PUBLIC_SHOP,
      payload: data
   }
}

function fetchShopsFailure(data) {
   return {
      type: FETCH_SHOPS_ERROR,
      payload: data
   }
}

export function shopsLoading() {
   return {
      type: LOADING_SHOPS
   }
}

function fetchShopProductsSuccess(data) {
   return {
      type: ADD_SHOP_PRODUCTS,
      payload: data
   }
}

function fetchShopPublicProductsSuccess(data) {
   return {
      type: ADD_PUBLIC_SHOP_PRODUCTS,
      payload: data
   }
}

function fetchShopCategoriesSuccess(data) {
   return {
      type: ADD_SHOP_CATEGORIES,
      payload: data
   }
}

// function fetchShopsFailure(data) {
//    return {
//       type: FETCH_SHOP_PRODUCTS_ERROR,
//       payload: data
//    }
// }

export function shopProductsLoading() {
   return {
      type: LOADING_SHOP_PRODUCTS
   }
}

export function handleShopsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchShopsSuccess(data.data);
   } else {
      return fetchShopsFailure({
         message: data.message
      });
   }
}

export function handlePublicShopsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchPublicShopsSuccess(data.data);
   } else {
      console.log('handlePublicShopsResponse ERROR: ', data.message)
   }
}

export function handleShopProductsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchShopProductsSuccess(data.data);
   } else {
      console.log('ERR - handleShopProductsResponse ', data.message)
      // return fetchShopProductsFailure({
      //    message: data.message
      // });
   }
}

export function handlePublicShopProductsResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchShopPublicProductsSuccess(data.data);
   } else {
      console.log('ERR - handlePublicShopProductsResponse ', data.message)
      // return fetchShopProductsFailure({
      //    message: data.message
      // });
   }
}

export function handleCategoryResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchShopCategoriesSuccess(data.data);
   } else {
      console.log('ERR - fetchShopProductsFailure ', data.message)
      // return fetchShopProductsFailure({
      //    message: data.message
      // });
   }
}