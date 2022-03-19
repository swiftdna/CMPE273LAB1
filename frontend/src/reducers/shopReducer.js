import {
  ADD_SHOPS,
  ADD_PUBLIC_SHOP,
  LOADING_SHOPS,
  CLEAR_SHOPS,
  ADD_SHOP_PRODUCTS,
  LOADING_SHOP_PRODUCTS,
  CLEAR_SHOP_PRODUCTS,
  ADD_SHOP_CATEGORIES,
  ADD_PUBLIC_SHOP_PRODUCTS
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  productsloading: false,
  data: {},
  publicShopData: {},
  products: [],
  publicShopProducts: [],
  categories: [],
  error: false,
  errorMessage: ''
};

export default function shopReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SHOPS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      }
    }
    case ADD_PUBLIC_SHOP: {
      return {
        ...state,
        loading: false,
        publicShopData: action.payload
      }
    }
    case LOADING_SHOPS: {
      return {
        ...state,
        loading: true
      }
    }
    case CLEAR_SHOPS:
      return {
        ...state,
        data: []
      }
    case ADD_SHOP_PRODUCTS: {
      return {
        ...state,
        productsloading: false,
        products: action.payload
      }
    }
    case ADD_PUBLIC_SHOP_PRODUCTS: {
      return {
        ...state,
        loading: false,
        publicShopProducts: action.payload
      }
    }
    case LOADING_SHOP_PRODUCTS: {
      return {
        ...state,
        productsloading: true
      }
    }
    case CLEAR_SHOP_PRODUCTS:
      return {
        ...state,
        products: []
      }
    case ADD_SHOP_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      }
    default:
      return state
  }
}