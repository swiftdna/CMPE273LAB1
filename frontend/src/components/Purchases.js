import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { selectLoading, selectPurchasesData } from '../selectors/purchasesSelector';
import { selectCurrency } from '../selectors/appSelector';
import { useNavigate } from 'react-router-dom';
import { getPurchases } from '../utils';
import moment from 'moment';

function Purchases() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const purchases = useSelector(selectPurchasesData);
    const currency = useSelector(selectCurrency);

    useEffect(() => {
        getPurchases(dispatch, { details: true });
    }, []);

    const getDateText = (data) => {
        return moment(data).format('DD MMM YYYY');
    };

    const openProduct = (id) => {
        navigate(`/product/${id}`);
    };

    return(
        <div className="container pull-down fill-page">
            <h5>Your Purchases</h5>
            {
                loading && <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            {
                purchases && purchases.length ? purchases.map(purchase =>
                        <ListGroup key={purchase.id} className="order_item">
                          <ListGroup.Item className="order_item_heading">Date: {getDateText(purchase.createdAt)} <span className="total">Total: {currency}{purchase.total}</span> <span className="order_id">Order ID: {purchase.id}</span></ListGroup.Item>
                          {purchase.details && purchase.details.length ? <ListGroup.Item>
                                <Row style={{textAlign: 'center', fontWeight: 'bold'}}>
                                    <Col xs={2}>
                                        Image
                                    </Col>
                                    <Col xs={6}>Product Name</Col>
                                    <Col xs={2}>Product Qty</Col>
                                    <Col xs={2}>Product Total</Col>
                                </Row>
                            </ListGroup.Item> : ''
                          }
                          {purchase.details && purchase.details.map(dtl => 
                            <ListGroup.Item key={dtl.id}>
                                <Row style={{textAlign: 'center'}}>
                                    <Col xs={2} onClick={() => openProduct(dtl.product.id)} style={{cursor: 'pointer'}}>
                                        <Image src={dtl.product && dtl.product.photo_url} style={{objectFit: 'cover', width: '50px', height: '50px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />
                                    </Col>
                                    <Col xs={6}>{dtl.product && dtl.product.name}</Col>
                                    <Col xs={2}>{dtl.product && dtl.product.qty}</Col>
                                    <Col xs={2}>{currency}{dtl.product && dtl.product.price * dtl.product.qty}</Col>
                                </Row>
                            </ListGroup.Item>
                            )
                          }
                        </ListGroup>
                    ) :
                    <p>No Purchases found</p>
            }
        </div>
    )
}

export default Purchases;