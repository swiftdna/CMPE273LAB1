import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
// import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import Login from '../components/Login';
const mockStore = configureStore({});

const initState = {
  app: {
    alert: false,
    toast: false,
    alertMessage: '',
    alertType: 'error',
    isLoggedIn: false,
    user: {},
    currency: 'USD',
    countries: []
  },
  products: {
    loading: false,
    data: [],
    error: false,
    errorMessage: ''
  },
  favourites: {
    loading: false,
    data: [],
    error: false,
    errorMessage: ''
  },
  profile: {
    loading: false,
    data: {},
    error: false,
    errorMessage: ''
  },
  productDetails: {
    loading: false,
    data: {},
    error: false,
    errorMessage: ''
  },
  purchases: {
    loading: false,
    data: [],
    error: false,
    errorMessage: ''
  },
  cartDetails: {
    loading: false,
    cart_id: null,
    data: [],
    error: false,
    errorMessage: ''
  },
  shops: {
    loading: false,
    productsloading: false,
    data: {},
    publicShopData: {},
    products: [],
    publicShopProducts: [],
    categories: [],
    error: false,
    errorMessage: ''
  }
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = mockStore(initState);
  ReactDOM.render(<Provider store={store}>
                    <Router>
                      <Login />
                    </Router>
                  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
