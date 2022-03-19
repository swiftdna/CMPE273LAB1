import {
   ADD_FAVOURITES,
   LOADING_FAVOURITES,
   CLEAR_FAVOURITES,
   FETCH_FAVOURITES_ERROR
} from '../constants/actionTypes';

function fetchFavouritesSuccess(data) {
   return {
      type: ADD_FAVOURITES,
      payload: data
   }
}

function fetchFavouritesFailure(data) {
   return {
      type: FETCH_FAVOURITES_ERROR,
      payload: data
   }
}

export function favouritesLoading() {
   return {
      type: LOADING_FAVOURITES
   }
}

export function handleFavouritesResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchFavouritesSuccess(data.data);
   } else {
      return fetchFavouritesFailure({
         message: data.message
      });
   }
}