import {
  ADD_CART_ITEMS,
  LOADING_CART_ITEMS,
  CLEAR_CART_ITEMS,
  ADD_CART_ID
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  cart_id: null,
  data: [],
  error: false,
  errorMessage: ''
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_CART_ID: {
      return {
        ...state,
        cart_id: action.payload
      }
    }
    case ADD_CART_ITEMS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_CART_ITEMS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_CART_ITEMS:
      return {
        ...state,
        data: []
      }
    default:
      return state
  }
}