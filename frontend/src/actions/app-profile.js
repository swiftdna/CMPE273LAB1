import {
   ADD_PROFILE,
   LOADING_PROFILE,
   CLEAR_PROFILE,
   FETCH_PROFILE_ERROR
} from '../constants/actionTypes';

function fetchProfileSuccess(data) {
   return {
      type: ADD_PROFILE,
      payload: data
   }
}

function fetchProfileFailure(data) {
   return {
      type: FETCH_PROFILE_ERROR,
      payload: data
   }
}

export function profileLoading() {
   return {
      type: LOADING_PROFILE
   }
}

export function handleProfilesResponse(response) {
   const {data} = response;
   if (data.success) {
      return fetchProfileSuccess(data.data);
   } else {
      return fetchProfileFailure({
         message: data.message
      });
   }
}