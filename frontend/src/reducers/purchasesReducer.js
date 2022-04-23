import {
  ADD_PURCHASES,
  LOADING_PURCHASES,
  CLEAR_PURCHASES
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  total: 0,
  errorMessage: ''
};

export default function purchasesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PURCHASES: {
      const {data, total} = action.payload;
      return {
        ...state,
        loading: false,
        data,
        total
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
        data: [],
        total: 0
      }
    default:
      return state
  }
}