import {
  ADD_PURCHASES,
  LOADING_PURCHASES,
  CLEAR_PURCHASES
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  errorMessage: ''
};

export default function purchasesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PURCHASES: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_PURCHASES: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_PURCHASES:
      return {
        ...state,
        data: []
      }
    default:
      return state
  }
}