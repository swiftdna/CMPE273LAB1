import {
  ADD_PROFILE,
  LOADING_PROFILE,
  CLEAR_PROFILE
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: {},
  error: false,
  errorMessage: ''
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PROFILE: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case LOADING_PROFILE: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_PROFILE:
      return {
        ...state,
        data: {}
      }
    default:
      return state
  }
}