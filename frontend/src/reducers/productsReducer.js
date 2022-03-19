import {
  ADD_PRODUCTS,
  LOADING_PRODUCTS,
  CLEAR_PRODUCTS
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  errorMessage: ''
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PRODUCTS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_PRODUCTS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_PRODUCTS:
      return {
        ...state,
        data: []
      }
    default:
      return state
  }
}