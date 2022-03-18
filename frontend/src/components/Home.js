import React from 'react';
import Navbar from './Navbar';
import '../App.css';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUser } from '../selectors/appSelector';

function Home() {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userObj = useSelector(selectUser);
    
    return(
        <div className="container pull-down">
            {isLoggedIn ?
                <h5>Welcome {userObj.username}!</h5> : 
                <h5>Hello, login or register to access the page!</h5>}
        </div>
    )
}

export default Home;