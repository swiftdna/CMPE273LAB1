import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
// import {FaShoppingCart, FaRegHeart, FaHeart} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductDetails } from '../selectors/productDetailsSelector';
import { selectCartID, selectCartDetails } from '../selectors/cartSelector';
import { fetchProductDetails, addItemToCart, updatedItemInCart } from '../utils';
import { Row, Col, Button, InputGroup, Badge } from 'react-bootstrap';
import { selectCurrency } from '../selectors/appSelector';
import Image from 'react-bootstrap/Image';

function ProductDetails() {

    const urlParams = useParams();
    const dispatch = useDispatch();
    const productDetails = useSelector(selectProductDetails);
    const cartDetails = useSelector(selectCartDetails);
    const cartID = useSelector(selectCartID);
    const currency = useSelector(selectCurrency);
    const [selectedQty, setSelectedQty] = useState(1);

    const { productID } = urlParams;

    useEffect(() => {
        fetchProductDetails(dispatch, productID);
    }, []);

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
        const { id, price } = productDetails;
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
    };

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
                    <Button variant="danger" style={{display: 'block', marginBottom: '10px'}} onClick={() => console.log('fav inside')}>Favourite</Button>
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