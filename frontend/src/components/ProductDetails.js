import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { pluck } from 'underscore';
// import {FaShoppingCart, FaRegHeart, FaHeart} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductDetails } from '../selectors/productDetailsSelector';
import { selectCartID, selectCartDetails } from '../selectors/cartSelector';
import { selectFavourites } from '../selectors/favouritesSelector';
import { fetchProductDetails, addItemToCart, updatedItemInCart, favourite, unfavourite } from '../utils';
import { Row, Col, Button, InputGroup, Badge } from 'react-bootstrap';
import { selectCurrency, selectUser } from '../selectors/appSelector';
import { selectShopCategories } from '../selectors/shopSelector';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Image from 'react-bootstrap/Image';

function ProductDetails() {

    const urlParams = useParams();
    const dispatch = useDispatch();
    const productDetails = useSelector(selectProductDetails);
    const favourites = useSelector(selectFavourites);
    const cartDetails = useSelector(selectCartDetails);
    const shopCategories = useSelector(selectShopCategories);
    const cartID = useSelector(selectCartID);
    const currency = useSelector(selectCurrency);
    const userObj = useSelector(selectUser);
    const [selectedQty, setSelectedQty] = useState(1);

    const { productID } = urlParams;

    useEffect(() => {
        fetchProductDetails(dispatch, productID);
    }, [productID]);

    const incQty = () => {
        if (selectedQty < Number(productDetails.qty)) {
            const currentQty = Number(selectedQty)
            setSelectedQty(currentQty + 1);
        }
    };

    const decQty = () => {
        if (selectedQty > 1) {
            const currentQty = Number(selectedQty);
            setSelectedQty(currentQty - 1);
        }
    };

    const addToCart = () => {
        // pid, qty, price must be captured
        console.log('add to cart >>> ', productDetails);
        const { _id: id, price } = productDetails;
        const existingProdRecArr = cartDetails.filter(cartDet => cartDet.item_id === id);
        const existingProdRec = existingProdRecArr && existingProdRecArr.length ? existingProdRecArr[0] : {};
        const newQty = existingProdRec && existingProdRec.qty ? selectedQty + existingProdRec.qty : selectedQty;
        // Check if the item exists in cart
        if (existingProdRec && existingProdRec._id) {
            const cartItemId = existingProdRec._id;
            updatedItemInCart(dispatch, cartItemId, { item_id: id, qty: newQty, price });
        } else {
            addItemToCart(dispatch, cartID, { item_id: id, qty: selectedQty, price });
        }
    };

    const markFav = (id) => {
        favourite(dispatch, id, userObj);
    };

    const markUnFav = (id) => {
        unfavourite(dispatch, id, userObj);
    };

    const favs = pluck(favourites, 'item_id');
    console.log(shopCategories);
    return(
        <div className="container pull-down fill-page">
            <Row>
                <Col xs={5}>
                    <Image src={productDetails.photo_url} style={{maxWidth: '500px'}} />
                </Col>
                <Col>
                    <h4>{productDetails.name} <Badge bg="success" style={{fontSize: '14px'}}>{currency} {productDetails.price}</Badge></h4>
                    {productDetails.shop_details && productDetails.shop_details.name ? <p style={{"margin":"0","marginTop":"-12px","marginBottom":"10px","fontSize":"12px","color":"#808080"}}>
                      {productDetails.shop_details.name}
                    </p> : '' }
                    <div style={{position: 'block', marginBottom: '13px'}}>
                        {
                            productDetails._id && favs.indexOf(productDetails._id) !== -1 ?
                            <FaHeart  className="card-btn" style={{color: '#cc0000'}} title="Favourites" size="1.5em" onClick={() => markUnFav(productDetails._id)} /> :
                            <FaRegHeart className="card-btn" style={{color: '#cc0000'}} title="Favourites" size="1.5em" onClick={() => markFav(productDetails._id)} />
                        }
                    </div>

                    
                    <Button variant="outline-danger" onClick={() => decQty()}>-</Button>
                    <input style={{ display: 'inline', width: '39px', margin: '0px 2px'}} type="text" className="form-control" readOnly value={selectedQty} />
                    <Button variant="outline-success" onClick={() => incQty()}>+</Button>
                    <Button style={{ marginLeft: '5px'}} variant="outline-primary" onClick={() => addToCart()}>Add to cart</Button>
                    <p style={{marginTop: '20px'}}><span style={{fontWeight: 'bold'}}>Stock Available:</span> {productDetails.qty}</p>
                    <p style={{marginTop: '10px', fontWeight: 'bold'}}>Product Description:</p>
                    <p>{productDetails.description}</p>
                </Col>
            </Row>
        </div>
    )
}

export default ProductDetails;