import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { pluck } from 'underscore';
import { fetchProducts, fetchFavourites, favourite, unfavourite, addItemToCart, updatedItemInCart } from '../utils';
import { favouritesLoading, handleFavouritesResponse } from '../actions/app-favourites';
import { selectLoading, selectProducts } from '../selectors/productsSelector';
import { selectFavourites } from '../selectors/favouritesSelector';
import { selectIsLoggedIn, selectUser, selectCurrency } from '../selectors/appSelector';
import { selectCartID, selectCartDetails } from '../selectors/cartSelector';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import Products from './Products';
import Handle from './Handle';
import Track from './Track';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'

//create the Navbar Component
function LandingPage() {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userObj = useSelector(selectUser);
    const cartID = useSelector(selectCartID);
    const cartDetails = useSelector(selectCartDetails);
    const products = useSelector(selectProducts);
    const favourites = useSelector(selectFavourites);
    const currency = useSelector(selectCurrency);
    const navigate = useNavigate();
    const [oosFlag, setOOSFlag] = useState(true);
    const [sortBy, setSortBy] = useState('');
    const [showSlider, setShowSlider] = useState(false);
    const [filterObj, setFilterObj] = useState({ 
        startPrice: 0,
        endPrice: 3000,
        from: 0,
        to: 3000
    });

    // useEffect(() => {
    //     // Fix max min
    //     let min = Number.MAX_SAFE_INTEGER;
    //     let max = Number.MIN_SAFE_INTEGER;
    //     let tmpObj = {...filterObj};
    //     products.map(prod => {
    //         if (prod.price < min) {
    //             min = prod.price;
    //         }
    //         if (prod.price > max) {
    //             max = prod.price;
    //         }
    //     });
    //     if (min !== Number.MAX_SAFE_INTEGER && max !== Number.MIN_SAFE_INTEGER) {
    //         setShowSlider(true);
    //         setFilterObj({ ...tmpObj, startPrice: min, endPrice: max, from: min, to: max });
    //     }
    // }, [products]);

    useEffect(() => {
        // fetchProducts(dispatch);
        if (isLoggedIn) {
            fetchFavourites(dispatch, userObj);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (sortBy) {
            fetchProducts(dispatch, {sortBy});    
            return;
        }
        fetchProducts(dispatch);
    }, [sortBy]);

    const openProduct = (id) => {
        navigate(`/product/${id}`);
    }

    const openShop = (dispatch, id) => {
        navigate(`/shop/${id}`);
    }

    const addToCart = (dispatch, product, userObj) => {
        const { id, price } = product;
        const selectedQty = 1;
        const existingProdRecArr = cartDetails.filter(cartDet => cartDet.item_id === id);
        const existingProdRec = existingProdRecArr && existingProdRecArr.length ? existingProdRecArr[0] : {};
        const newQty = existingProdRec && existingProdRec.qty ? selectedQty + existingProdRec.qty : selectedQty;
        // Check if the item exists in cart
        if (existingProdRec && existingProdRec.id) {
            const cartItemId = existingProdRec.id;
            updatedItemInCart(dispatch, cartItemId, { item_id: id, qty: newQty, price });
        } else {
            addItemToCart(dispatch, cartID, { item_id: id, qty: selectedQty, price });
        }
    }

    const onSelectChange = (event) => {
        setSortBy(event.target.value);
        // Trigger method call
    }

    const filterByPrice = ([from, to]) => {
        console.log(from, to);
        setSortBy('');
        fetchProducts(dispatch, { filter: 'price_range', from, to });
    }

    const changeSwitch = (e) => {
        const currentValue = !oosFlag;
        setOOSFlag(currentValue);
        fetchProducts(dispatch, { type: 'out_of_stock', enabled: currentValue });
    }

    const favs = pluck(favourites, 'item_id');

    const sliderStyle = {  // Give the slider some width
      position: 'relative',
      width: '100%',
      height: 40,
      marginLeft: '20px'
    }

    const railStyle = {
      position: 'absolute',
      width: '100%',
      height: 10,
      marginTop: 15,
      borderRadius: 5,
      backgroundColor: '#8B9CB6',
    }
    
    return(
        <div className="container main-frame fill-page">
            <Row style={{width: '100%'}}>
                <Col xs={3}>
                    <Slider
                        rootStyle={sliderStyle}
                        domain={[filterObj.startPrice, filterObj.endPrice]}
                        step={1}
                        mode={2}
                        values={[filterObj.from, filterObj.to]}
                        onChange={(e) => filterByPrice(e)}
                      >
                    <Rail>
                      {({ getRailProps }) => (
                        <div style={railStyle} {...getRailProps()} />
                      )}
                    </Rail>
                    <Handles>
                      {({ handles, getHandleProps }) => (
                        <div className="slider-handles">
                          {handles.map(handle => (
                            <Handle
                              key={handle.id}
                              handle={handle}
                              getHandleProps={getHandleProps}
                            />
                          ))}
                        </div>
                      )}
                    </Handles>
                    <Tracks right={false}>
                      {({ tracks, getTrackProps }) => (
                        <div className="slider-tracks">
                          {tracks.map(({ id, source, target }) => (
                            <Track
                              key={id}
                              source={source}
                              target={target}
                              getTrackProps={getTrackProps}
                            />
                          ))}
                        </div>
                      )}
                    </Tracks>
                  </Slider>
                </Col>
                <Col xs={6}>
                    <p style={{color: '#808080', marginLeft: '50px', textAlign: 'center'}}>{products.length} products found</p>
                </Col>
                <Col xs={3} style={{marginLeft: 'auto', marginRight: '0'}}>
                    <Form.Select aria-label="sorting" value={sortBy} onChange={onSelectChange}>
                      <option value="">Select sorting</option>
                      <option value="price">Price</option>
                      <option value="qty">Quantity</option>
                      <option value="sales">Sales Count</option>
                    </Form.Select>
                    <Form.Check 
                        checked={oosFlag}
                        type="switch"
                        style={{ float: 'right', fontSize: '14px' }}
                        id="out_of_stock"
                        onChange={e => changeSwitch(e)}
                        label="include out of stock items"
                      />
                </Col>
            </Row>
            <Products data={products} extras={{favs, userObj, currency}} loading={loading} flags={{isLoggedIn}} fn={{favourite, openProduct, unfavourite, dispatch, openShop, addToCart}} disabled={['edit']} />
        </div>
    )
}

export default LandingPage;