import {
  ADD_PRODUCT_DETAILS,
  LOADING_PRODUCT_DETAILS,
  CLEAR_PRODUCT_DETAILS
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: {},
  error: false,
  errorMessage: ''
};

export default function productDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PRODUCT_DETAILS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_PRODUCT_DETAILS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_PRODUCT_DETAILS:
      return {
        ...state,
        data: {}
      }
    default:
      return state
  }
}