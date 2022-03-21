import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes,
  Route
} from "react-router-dom";
import Login from './Login';
import Navbar from './Navbar';
import Footer from './Footer';
// import Home from './Home';
import LandingPage from './LandingPage';
import Profile from './Profile';
import Register from './Register';
import Favourites from './Favourites';
import ProductDetails from './ProductDetails';
import Purchases from './Purchases';
import Shop from './Shop';
import ShopPage from './ShopPage';
import { useLocation } from 'react-router-dom';
import Cart from './Cart';
import { checkSession } from '../utils';
import ProtectedRoute from './ProtectedRoute';
import {Toast, ToastContainer} from 'react-bootstrap';
import { selectAlertFlag, selectToastFlag, selectAlertMessage, selectAlertType, selectIsLoggedIn } from '../selectors/appSelector';
import { clearToast } from '../actions/app-actions';

//Create a Main Component
export function Main() {
    const alert = useSelector(selectAlertFlag);
    const toast = useSelector(selectToastFlag);
    const alertMessage = useSelector(selectAlertMessage);
    const alertType = useSelector(selectAlertType);
    const isAuthenticated = useSelector(selectIsLoggedIn);
    const location = useLocation();
    const dispatch = useDispatch();
    const alertMapping = {
        'error': 'alert alert-danger',
        'success': 'alert alert-success',
        'warning': 'alert alert-warning',
        'info': 'alert alert-info'
    }
    
    useEffect(() => {
        checkSession(dispatch);
    }, []);

    return(
        <>
            {location.pathname !== '/login' && <Navbar />}
            {
                alert ? 
                <div className="container pull-down">
                    <div className={alertMapping && alertMapping[alertType] ? alertMapping[alertType]: "alert alert-danger"} role="alert">
                        {alertMessage}
                    </div>
                </div> : ''
            }
            <ToastContainer className="p-3" position={'bottom-end'} style={{zIndex: 10}}>
                <Toast onClose={() => dispatch(clearToast())} show={toast} delay={4000} autohide>
                  <Toast.Header>
                    <strong className="me-auto">{alertType}</strong>
                  </Toast.Header>
                  <Toast.Body>{alertMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* <Route path="/home" element={isAuthenticated ? <Home /> : <Login />} /> */}
              <Route path="/product/:productID" element={<ProductDetails />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favourites" element={isAuthenticated ? <Favourites /> : <Login />} />
              <Route path="/purchases" element={isAuthenticated ? <Purchases /> : <Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shop" element={isAuthenticated ? <Shop /> : <Login />} />
              <Route path="/shop/:shopID" element={<ShopPage />} />
              <Route path="/" element={<LandingPage />} />
            </Routes>
            {location.pathname !== '/login' && <Footer />}
        </>
    )
}
//Export The Main Component
export default Main;