import { combineReducers } from 'redux';

import appReducer from './appReducer';
import productsReducer from './productsReducer';
import productDetailsReducer from './productDetailsReducer';
import favReducer from './favouritesReducer';
import profileReducer from './profileReducer';
import cartDetailsReducer from './cartReducer';
import purchasesReducer from './purchasesReducer';

const rootReducer = combineReducers({
  app: appReducer,
  products: productsReducer,
  favourites: favReducer,
  profile: profileReducer,
  productDetails: productDetailsReducer,
  cartDetails: cartDetailsReducer,
  purchases: purchasesReducer
})

export default rootReducer