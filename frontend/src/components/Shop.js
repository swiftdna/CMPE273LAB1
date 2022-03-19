import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner, InputGroup, Button, FormControl, Badge, Modal, Form, Image, Row, Col } from 'react-bootstrap';
import AddProduct from './AddProduct';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { getShopDetails, createShop, modifyShop, uploadImageToCloud } from '../utils';
import { selectShopDetails, selectShopProducts, selectLoading } from '../selectors/shopSelector';
import { FaPencilAlt, FaSave } from 'react-icons/fa';
import { setToast } from '../actions/app-actions';
import { selectUser, selectCurrency } from '../selectors/appSelector';
import Products from './Products';

function Shop() {
    const [shopName, setShopName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [addProductOn, setAddProductOn] = useState(false);
    const [nameExists, setNameExists] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const shopDetails = useSelector(selectShopDetails);
    const [shopForm, setShopForm] = useState(shopDetails);
    const products = useSelector(selectShopProducts);
    const productsLoading = useSelector(selectLoading);
    const userObj = useSelector(selectUser);
    const currency = useSelector(selectCurrency);

    useEffect(() => {
        getShopDetails(dispatch);
    }, []);

    useEffect(() => {
        setShopForm(shopDetails);
    }, [shopDetails])

    const onInputChange = (e) => {        
        setShopName(e.target.value);
        setNameExists(null);
    };

    const onFormInputChange = (e) => {
        const fieldName = e.target.getAttribute('id');
        const tempForm = {...shopForm};
        tempForm[fieldName] = e.target.value;
        setShopForm(tempForm);
    }

    const submitShopName = () => {
        axios.get(`/api/shops/check/${shopName}`)
            .then(response => {
                const {data: dataObj} = response;
                const { data } = dataObj ? dataObj : {};
                setNameExists(data.exist);
            });
    };

    const handleKeyPress = (event) => {
      if(event.key === 'Enter') {
        submitShopName();
      }
    };

    const addShop = () => {
        if (shopName && nameExists === false) {
            createShop(dispatch, { name: shopName });
        } else {
            console.log('will not create');
        }
    };

    const handleClose = () => {
        setEditMode(false);
    };

    const handleAddProductClose = () => {
        console.log('handleAddProductClose called');
        setAddProductOn(false);
    };

    const openProduct = (id) => {
        navigate(`/product/${id}`)
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        const res = await uploadImageToCloud(dispatch, e.target.files[0]);
          // console.log(res.data.secure_url);
        const {data: {secure_url}} = res;
        if (secure_url) {
            dispatch(setToast({
                type: 'success',
                message: 'Shop image uploaded successfully!'
            }));
        }
        const tempForm = {...shopForm};
        tempForm.image_url = secure_url;
        setShopForm(tempForm);
    };

    const submitShopChanges = () => {
        console.log('submit shop form -> ', shopForm);
        const {id, name, image_url} = shopForm;
        modifyShop(dispatch, id, {name, image_url}, (err, success) => {
            if (success) {
                handleClose();
            }
        });
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
                                <p>{shopDetails.name} {!editMode ? 
                                    <FaPencilAlt className="edit_icon" size="1em" onClick={() => setEditMode(!editMode) } /> :
                                    <FaSave className="edit_icon" size="1em" onClick={() => setEditMode(!editMode) } /> }
                                </p>
                                <p>
                                    Products: {products && products.length}
                                </p>
                            </Col>
                            <Col xs={2}>
                                <Button variant="primary" className="pull-right" onClick={() => setAddProductOn(!addProductOn)}>Add product</Button>
                            </Col>
                        </Row>
                        {
                            products && products.length ? 
                                <Products data={products} extras={{userObj, currency}} loading={productsLoading} fn={{openProduct, dispatch}} disabled={['cart']} /> : ''
                        }
                    </div>
                ) : ''}
            <AddProduct showFlag={addProductOn} data={shopDetails} fn={{handleAddProductClose}} />
            <Modal show={editMode} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit shop - {shopDetails.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="user_details">
                        <Form.Label htmlFor="name">Name</Form.Label>
                        {!editMode ? <p>{shopForm.name}</p> : 
                            <Form.Control
                                type="text"
                                id="name"
                                aria-describedby="name"
                                value={shopForm.name}
                                onChange={onFormInputChange}
                              />
                        }
                        {editMode ? 
                            <>
                            <Form.Label htmlFor="image">Image</Form.Label>
                            <Form.Control
                                type="file"
                                id="image"
                                aria-describedby="image"
                                onChange={uploadImage}
                              />
                            </> : ''
                        }
                        <Form.Label htmlFor="image_url">Image URL</Form.Label>
                        {!editMode ? <p>{shopForm.image_url}</p> : 
                            <Form.Control
                                type="text"
                                id="image_url"
                                aria-describedby="image_url"
                                value={shopForm.image_url}
                                disabled={true}
                              />
                        }
                        
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => submitShopChanges()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {!shopDetails || !shopDetails.name ? 
                <div style={{textAlign: 'center', marginTop: '130px'}}>
                    <h3>Name your shop</h3>
                    <p>Choose a memorable name that reflects your style</p>
                    {nameExists === false ? <Badge pill bg="success" style={{ fontSize: '13px' }}>
                      <FaCheck /> Available
                    </Badge> : ''}
                    {nameExists === true ? <Badge pill bg="danger" style={{ fontSize: '13px' }}>
                      <FaTimes /> Not Available
                    </Badge> : ''}
                    <InputGroup className="mb-3" style={{marginTop: '50px'}}>
                        <FormControl
                          placeholder="Shop name"
                          aria-label="Shop name"
                          aria-describedby="basic-addon2"
                          value={shopName}
                          onKeyPress={(e) => handleKeyPress(e)}
                          onChange={(e) => onInputChange(e)}
                        />
                        <Button variant="outline-warning" id="button-addon2" onClick={() => submitShopName()}>
                          Check availability
                        </Button>
                    </InputGroup>
                    <Button variant="primary" onClick={() => addShop()}>
                      Create
                    </Button>
                </div> : ''
            }
        </div>
    )
}

export default Shop;