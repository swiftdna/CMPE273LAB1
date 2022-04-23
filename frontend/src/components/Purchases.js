import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Row, Col, ListGroup, Image, Dropdown } from 'react-bootstrap';
import { selectLoading, selectPurchasesData, selectPurchasesTotal } from '../selectors/purchasesSelector';
import { selectCurrency } from '../selectors/appSelector';
import { useNavigate } from 'react-router-dom';
import { getPurchases } from '../utils';
import { FaGift } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import moment from 'moment';

function Purchases() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const purchases = useSelector(selectPurchasesData);
    const currency = useSelector(selectCurrency);
    const purchasesTotal = useSelector(selectPurchasesTotal);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        getPurchases(dispatch, { details: true, limit: pageSize });
    }, []);

    useEffect(() => {
        getPurchases(dispatch, { details: true, limit: pageSize });
    }, [pageSize]);

    const getDateText = (data) => {
        return moment(data).format('lll');
    };

    const openProduct = (id) => {
        navigate(`/product/${id}`);
    };

    const handlePageClick = (event) => {
        console.log('event.selected --->>> ', event.selected);
        const newOffset = (event.selected * pageSize) % purchasesTotal;
        console.log(
          `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        // setItemOffset(newOffset);
        getPurchases(dispatch, { details: true, limit: pageSize, skip: event.selected * pageSize });
    };

    return(
        <div className="container pull-down fill-page">
            {
                purchases && purchases.length ? 
                    <Dropdown className="pull-right pagn_limit">
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Display {pageSize} purchases
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setPageSize(2)}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => setPageSize(5)}>5</Dropdown.Item>
                        <Dropdown.Item onClick={() => setPageSize(10)}>10</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                : ''
            }
            <h5 style={{'marginBottom': '20px'}}>Your Purchases</h5>
            {
                loading && <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            {
                purchases && purchases.length ? purchases.map(purchase =>
                        <ListGroup key={purchase._id} className="order_item">
                          <ListGroup.Item className="order_item_heading">Date: {getDateText(purchase.createdAt)} <span className="total">Total: {currency}{purchase.total}</span> <span className="order_id">Order ID: {purchase._id}</span></ListGroup.Item>
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
                            <ListGroup.Item key={dtl._id}>
                                <Row style={{textAlign: 'center'}}>
                                    <Col xs={2} onClick={() => openProduct(dtl.product._id)} style={{cursor: 'pointer'}}>
                                        <Image src={dtl.product && dtl.product.photo_url} style={{objectFit: 'cover', width: '50px', height: '50px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />
                                    </Col>
                                    <Col xs={6}>
                                        {dtl.product && dtl.product.name}
                                        {dtl.gift && dtl.gift_description ? <p className="purchases gift_item"><FaGift className="icon" /> {dtl.gift_description}</p> : ''}
                                    </Col>
                                    <Col xs={2}>{dtl.qty}</Col>
                                    <Col xs={2}>{currency}{dtl.price * dtl.qty}</Col>
                                </Row>
                            </ListGroup.Item>
                            )
                          }
                        </ListGroup>
                    ) :
                    <p>No Purchases found</p>
            }
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={purchasesTotal / pageSize}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
        </div>
    )
}

export default Purchases;