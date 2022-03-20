import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, InputGroup, Button, FormControl, Badge, Modal, Form, Image, Row, Col } from 'react-bootstrap';
import { selectPublicShopDetails, selectPublicShopProducts, selectLoading } from '../selectors/shopSelector';
import Products from './Products';
import { selectUser, selectCurrency } from '../selectors/appSelector';
import { getShopDetailsByShopID } from '../utils';

function ShopPage() {
    const urlParams = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { shopID } = urlParams;
    const shopDetails = useSelector(selectPublicShopDetails);
    const products = useSelector(selectPublicShopProducts);
    const productsLoading = useSelector(selectLoading);
    const userObj = useSelector(selectUser);
    const currency = useSelector(selectCurrency);

    useEffect(() => {
        getShopDetailsByShopID(dispatch, shopID);
    },[shopID]);
    
    const openProduct = (id) => {
        navigate(`/product/${id}`)
    };

    return(
        <div className="container pull-down fill-page">
            {shopDetails && shopDetails.name ? 
                (
                    <div className="shop_container">
                        <Row>
                            <Col xs={2}>
                            {
                                shopDetails.image_url && <Image src={shopDetails.image_url} style={{width: '100px', height: '100px', display: 'block'}} />
                            }
                            </Col>
                            <Col>
                                <p>{shopDetails.name}</p>
                                <p>
                                    <Badge bg="warning" text="dark">Products: {products && products.length}</Badge> <Badge bg="warning" text="dark" className="total_sales_count">Total Sales: {shopDetails && shopDetails.totalSales}</Badge>
                                </p>
                            </Col>
                        </Row>
                        {
                            products && products.length ? 
                            <Row style={{marginTop: '15px'}}>
                                <h5>Products:</h5>
                                <Products data={products} extras={{userObj, currency}} loading={productsLoading} fn={{openProduct, dispatch}} disabled={['cart', 'edit']} />
                            </Row> : ''
                        }
                    </div>
                ) : ''}
        </div>
    )
}

export default ShopPage;