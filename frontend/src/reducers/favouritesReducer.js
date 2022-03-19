import {
  ADD_FAVOURITES,
  LOADING_FAVOURITES,
  CLEAR_FAVOURITES
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: false,
  errorMessage: ''
};

export default function favReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FAVOURITES: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_FAVOURITES: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_FAVOURITES:
      return {
        ...state,
        data: []
      }
    default:
      return state
  }
}