import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes,
  Route
} from "react-router-dom";
import Login from './Login';
import Navbar from './Navbar';
// import Footer from './Footer';
// import Home from './Home';
import { useLocation } from 'react-router-dom';
import { checkSession } from '../utils';
import ProtectedRoute from './ProtectedRoute';
import {Toast} from 'react-bootstrap';
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
            <Toast className="custom_toast" onClose={() => dispatch(clearToast())} show={toast} delay={4000} autohide>
              <Toast.Header>
                <strong className="me-auto">{alertType}</strong>
                <small>click x to dismiss</small>
              </Toast.Header>
              <Toast.Body>{alertMessage}</Toast.Body>
            </Toast>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
            {/* <Footer /> */}
        </>
    )
}
//Export The Main Component
export default Main;