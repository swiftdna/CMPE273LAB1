import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import { FaList, FaShoppingCart, FaUserAlt, FaHeart, FaStore } from 'react-icons/fa';
import { selectErrorFlag, selectErrorMessage, selectIsLoggedIn } from '../selectors/appSelector';
import { selectFavourites } from '../selectors/favouritesSelector';
import { selectCartDetails } from '../selectors/cartSelector';
import { handleLogoutResponse } from '../actions/app-actions';
import { getCartID, fetchProducts } from '../utils';

//create the Navbar Component
function Navbar() {
    const isAuthenticated = useSelector(selectIsLoggedIn);
    const favouriteItems = useSelector(selectFavourites);
    const cartItems = useSelector(selectCartDetails);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            // Get cart id for future cart additions
            getCartID(dispatch);
        }
    }, [isAuthenticated])

    const login = () => {
        navigate('/login');
    }

    const register = () => {
        navigate('/register');
    }

    const home = () => {
        navigate('/');
    }

    const favourites = () => {
        navigate('/favourites');
    }

    const profile = () => {
        navigate('/profile');
    }

    const cart = () => {
        navigate('/cart');
    }

    const purchases = () => {
        navigate('./purchases');
    };

    const shop = () => {
        navigate('./shop');
    }

    const logout = () => {
        axios.post('http://localhost:3000/logout')
            .then(response => {
                dispatch(handleLogoutResponse(response));
            });
    }

    const onSearchTextChange = (e) => {
        setSearchText(e.target.value);
    };

    const submitSearch = () => {
        console.log(searchText);
        fetchProducts(dispatch, { type: 'search', value: searchText });
    };

    return(
        <nav className="navbar navbar-light bg-light justify-content-between">
            <div className="container">
                <div className="col-1">
                    <a className="navbar-brand" onClick={() => home()}>Etsy</a>
                </div>
                <div className="col-8">
                    <input style={{display: 'inline', width: '91%', borderTopRightRadius: 0, borderBottomRightRadius: 0}} className="form-control mr-sm-2" type="search" value={searchText} onChange={onSearchTextChange} placeholder="Enter search text" aria-label="Search" />
                    <Button style={{display: 'inline', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginTop: '-4px'}} variant="warning" onClick={() => submitSearch()}>Search</Button>
                </div>
                <div className="col-3 center-contents">
                    {
                        isAuthenticated ? 
                        <button type="button" className="btn btn-light nav-buttons" title="Log out" onClick={() => logout()}>Logout</button> : 
                        <>
                            <button type="button" className="btn btn-light nav-buttons" title="Log In" onClick={() => login()}>login</button>
                            <button type="button" className="btn btn-light nav-buttons" title="Log In" onClick={() => register()}>register</button>
                        </>
                    }
                    {
                        isAuthenticated && (
                            <>
                                <FaHeart className="nav-buttons" title="Favourites" size="3em" onClick={() => favourites()}/>
                                {favouriteItems && favouriteItems.length ? 
                                    <Badge pill bg="primary" style={{"position":"absolute","marginLeft":"-17px","marginTop":"-3px"}}>{favouriteItems.length}</Badge> : ''}
                                <FaList className="nav-buttons" title="Purchases" size="3em" onClick={() => purchases()}/>
                                <FaStore className="nav-buttons" title="Shop" size="3em" onClick={() => shop()}/>
                                <FaUserAlt className="nav-buttons" title="Profile" size="3em" onClick={() => profile()}/>
                            </>)
                    }
                    <FaShoppingCart className="nav-buttons" title="Shopping Cart" size="3em" onClick={() => cart()} />{cartItems && cartItems.length ? <Badge pill bg="primary" style={{"position":"absolute","marginLeft":"-17px","marginTop":"-3px"}}>{cartItems.length}</Badge> : ''}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;