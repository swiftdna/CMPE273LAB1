import Navbar from './Navbar';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartID, selectCartDetails } from '../selectors/cartSelector';
import { selectCurrency } from '../selectors/appSelector';
import { getCartItems, updatedItemInCart, createOrder } from '../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Row, Col, Button} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

export default function Cart() {

	const cartID = useSelector(selectCartID);
	const cartItems = useSelector(selectCartDetails);
    const currency = useSelector(selectCurrency);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (cartID) {
			getCartItems(dispatch, cartID);
		}
	}, [cartID]);

	const calcTotal = () => {
		if (!cartItems || !cartItems.length) {
			return 0;
		}
		const x = cartItems.reduce((total, item) => {
			return total + (item.qty * item.price);
		}, 0);
		return x;
	};

	const placeOrder = () => {
		createOrder(dispatch, cartID, {
			status: 'active',
			total: calcTotal()
		}, (err, success) => {
			if (success) {
				navigate('/');
			}
		});
	};

	const openProduct = (id) => {
		navigate(`/product/${id}`);
	};

	return (
		<div className="container pull-down fill-page">
			{cartItems && cartItems.length ?
				<>
				<p>You have {cartItems.length} items in your cart.</p>
				<Row className="cart-item heading">
					<Col xs={2}>
						<p>Item Image</p>
					</Col>
					<Col>
						<p>Item Name</p>
					</Col>
					<Col xs={2}>
						<p>Item Qty</p>
					</Col>
					<Col xs={2}>
						<p>Item Price</p>
					</Col>
					<Col xs={2}>
						<p>Item Total</p>
					</Col>
				</Row>
				{cartItems.map(item => 
					<Row className="cart-item">
						<Col xs={2}>
							<Image src={item.product.photo_url} onClick={() => openProduct(item.product.id)} style={{objectFit: 'cover', cursor: 'pointer', width: '100px', height: '100px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />
						</Col>
						<Col>
							<p>{item.product.name}</p>
						</Col>
						<Col xs={2}>
							<p>{item.qty}</p>
						</Col>
						<Col xs={2}>
							<p>{currency}{item.price}</p>
						</Col>
						<Col xs={2}>
							<p>{currency}{item.qty * item.price}</p>
						</Col>
					</Row>
				)}
				<p>Your order total is {currency}{calcTotal()}</p>
				<div className="btn_panel">
					<Button variant="primary" onClick={() => placeOrder()}>Place order</Button>
					<Button variant="secondary">Clear cart</Button>
				</div>
			</>: <p>No items in the cart. Start shopping now!</p> }
        </div>
    )
}