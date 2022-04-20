import Navbar from './Navbar';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartID, selectCartDetails } from '../selectors/cartSelector';
import { selectCurrency } from '../selectors/appSelector';
import { FaGift, FaRegCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getCartItems, updatedItemInCart, createOrder, deleteItemInCart } from '../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Row, Col, Button, Form} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import {handleCartItemsResponse} from '../actions/cart-details-actions';

export default function Cart() {

	const cartID = useSelector(selectCartID);
	const cartItems = useSelector(selectCartDetails);
    const currency = useSelector(selectCurrency);
    const [giftTracker, setGiftTracker] = useState({});
    const [giftDescTracker, setGiftDescTracker] = useState({});
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

	const changeSwitch = (e, id) => {
		// console.log(e.target.id);
		// console.log(e.target.checked);
		setGiftTracker({...giftTracker, [id]: e.target.checked});
		// const tempCartItems = [...cartItems];
		// tempCartItems.map(tmp => {
		// 	if(tmp._id && tmp._id === id) {
		// 		tmp.gift = e.target.checked;
		// 	}
		// });
		// console.log('upd complete -> ', tempCartItems);
		// update store
		// dispatch(handleCartItemsResponse({data: { success: true, data: tempCartItems}}));
	}

	const onGiftInputChange = (e, id) => {
		setGiftDescTracker({...giftDescTracker, [id]: e.target.value});
	};

	const submitGiftEntry = (id) => {
		console.log(giftTracker[id]);
		console.log(giftDescTracker[id]);
		const filteredArr = cartItems.filter(cartItem => cartItem._id === id);
		if (filteredArr && filteredArr.length) {
			updatedItemInCart(dispatch, filteredArr[0]._id, {
				gift: giftTracker[id],
				gift_description: giftDescTracker[id]
			});
			setGiftTracker({...giftTracker, [id]: false});
			setGiftDescTracker({...giftDescTracker, [id]: null});
		}
		// Upon saving delete it from local state
	};

	const cancelGiftEntry = (id) => {
		setGiftTracker({...giftTracker, [id]: false });
	}

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

	const incQty = (cartItem) => {
		const increasedQty = Number(cartItem.qty) + 1;
        if (cartItem.qty < increasedQty) {
            updatedItemInCart(dispatch, cartItem._id, {
				qty: increasedQty
			});
        }
    };

    const decQty = (cartItem) => {
        // if (selectedQty > 1) {
        //     const currentQty = Number(selectedQty);
        //     setSelectedQty(currentQty - 1);
        // }
        const decreasedQty = Number(cartItem.qty) - 1;
        if (cartItem.qty > 1 && cartItem.qty > decreasedQty) {
            updatedItemInCart(dispatch, cartItem._id, {
				qty: decreasedQty
			});
        }
    };

    const removeItem = (id) => {
    	deleteItemInCart(dispatch, id, cartID);
    }

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
							<Image src={item.product.photo_url} onClick={() => openProduct(item.product._id)} style={{objectFit: 'cover', cursor: 'pointer', width: '100px', height: '100px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />
						</Col>
						<Col>
							<p>{item.product.name}</p>
							<p className="gift_item">
								{
									item.gift ?
										<>
											<FaGift className="icon"/> {item.gift_description}
										</> : 
										<>
											<input type="checkbox" id="gift_switch" value={giftTracker && giftTracker[item._id]} onChange={(e) => changeSwitch(e, item._id)} />
											<FaGift className="icon"/>
										</>
								}
								{
									giftTracker && giftTracker[item._id] ?
									<>
										<Form.Control
										    type="text"
										    id="giftdesc"
										    onChange={(e) => onGiftInputChange(e, item._id)}
										    value={giftDescTracker && giftDescTracker[item._id]}
										    aria-describedby="giftDescriptionHelpBlock"
										  />
										<FaRegCheckCircle onClick={() => submitGiftEntry(item._id)} className="ic_buttons"/>
										<FaTimesCircle onClick={() => cancelGiftEntry(item._id)} className="ic_buttons"/>
									</> : ''
								}
							</p>
						</Col>
						<Col xs={2}>
							<Button variant="outline-danger" onClick={() => decQty(item)}>-</Button>
		                    <input style={{ display: 'inline', width: '39px', margin: '0px 2px'}} type="text" className="form-control" readOnly value={item.qty} />
		                    <Button variant="outline-success" onClick={() => incQty(item)}>+</Button>
		                    <p onClick={() => removeItem(item._id)} className="delete_item">delete</p>
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