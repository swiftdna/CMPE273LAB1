import React, {useEffect} from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Products from './Products';
import { pluck } from 'underscore';
import { fetchProducts, fetchFavourites, favourite, unfavourite } from '../utils';
import { selectUser } from '../selectors/appSelector';
import { selectLoading, selectFavourites } from '../selectors/favouritesSelector';
import { useSelector, useDispatch } from 'react-redux';
import { selectErrorFlag, selectErrorMessage, selectIsLoggedIn, selectCurrency } from '../selectors/appSelector';
import { selectProducts } from '../selectors/productsSelector';
import { selectProfileData } from '../selectors/profileSelector';

export default function Favourites() {
    const userObj = useSelector(selectUser);
    const loading = useSelector(selectLoading);
    const favourites = useSelector(selectFavourites);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const products = useSelector(selectProducts);
    const userProfile = useSelector(selectProfileData);
    const currency = useSelector(selectCurrency);
    const dispatch = useDispatch();
    const navigate = useNavigate();

	useEffect(() => {
		fetchProducts(dispatch);
		fetchFavourites(dispatch, userObj);
    }, []);

    const openProduct = (id) => {
        navigate(`/product/${id}`);
    };

    const favs = pluck(favourites, 'item_id');
    const updatedProds = products.filter(product => favs.indexOf(product._id) !== -1);

	return (
		<div className="container pull-down fill-page">
	    	<h4>Favourites of {userProfile && userProfile.name ? userProfile.name : 'User'}</h4>
			{
				favourites && favourites.length ? <Products data={updatedProds} extras={{favs, userObj, currency}} loading={loading} flags={{isLoggedIn}} fn={{favourite, openProduct, unfavourite, dispatch}} disabled={['edit']} /> : 
					<p>No favourites found.</p>		
			}
        </div>
	);
}