import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Modal, Form, Button } from 'react-bootstrap';
import { setUserCurrency } from '../actions/app-actions';
import { selectCurrency } from '../selectors/appSelector';

export default function Footer() {
    const [showFlag, setShowFlag] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const dispatch = useDispatch();
    const currencySymbol = useSelector(selectCurrency);

    const onCurrencyClose = () => {
        setShowFlag(false);
    };

    const submitCurr = () => {
        // console.log('submitCurr ', currency);
        dispatch(setUserCurrency(currency));
        setShowFlag(false);
    };

    const openCurr = () => {
        console.log('open curr');
        setShowFlag(true);
    }

    const onCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };
    return (
        <footer className="page-footer font-small blue">
            <Row>
                <Col xs={6} className="text-center py-3">
                    United States | English (US) | <span className="currency_btn" onClick={() => openCurr()}>{currencySymbol}({currency})</span>
                </Col>
                <Col xs={6} className="footer-copyright text-center py-3">© 2022 Copyright</Col>
            </Row>
            <Modal show={showFlag} onHide={onCurrencyClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select a currency</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select aria-label="Select currency" value={currency} onChange={onCurrencyChange}>
                      <option>Select One</option>
                      <option value="USD">US Dollars</option>
                      <option value="INR">Indian Rupees</option>
                      <option value="EUR">Euro</option>
                      <option value="GBP">Great Britain Pounds</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCurrencyClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => submitCurr()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </footer>
    )
}