import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Spinner, InputGroup, Button, FormControl, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { addProduct, uploadImageToCloud, getProductCategories, addNewCategory, modifyProduct } from '../utils';
import { setToast } from '../actions/app-actions';
import { selectShopCategories, selectShopDetails } from '../selectors/shopSelector';


function AddProduct({data, showFlag, fn, mode}) {
    const dispatch = useDispatch();
    const categories = useSelector(selectShopCategories);
    const shopDetails = useSelector(selectShopDetails);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [productForm, setProductForm] = useState({
        name: '',
        image_url: '',
        description: '',
        price: '',
        category_id: '',
        qty: ''
    });

    useEffect(() => {
        getProductCategories(dispatch);
    }, [data]);

    useEffect(() => {
        if (mode === 'edit') {
            setProductForm(data);
        } else {
            setProductForm({
                name: '',
                image_url: '',
                description: '',
                price: '',
                category_id: '',
                qty: ''
            });
        }
    }, [mode]);

    const handleCloseButton = () => {
        if (mode === 'edit' && fn && fn.handleEditProductClose) {
            fn.handleEditProductClose();
        }
        if (mode === 'add' && fn && fn.handleAddProductClose) {
            fn.handleAddProductClose();
        }
    }

    const createProduct = () => {
        const productObj = {...productForm};
        productObj.shop_id = data._id;
        addProduct(dispatch, productObj, (err, successFlag) => {
            if (successFlag) {
                if (fn && fn.handleAddProductClose) {
                    setProductForm({
                        name: '',
                        image_url: '',
                        description: '',
                        price: '',
                        qty: ''
                    });
                    fn.handleAddProductClose();
                }
            }
        });
    }

    const editProduct = () => {
        // console.log('productForm => ', productForm);
        const tempObj = {...productForm};
        modifyProduct(dispatch, tempObj, (err, successFlag) => {
            if (successFlag) {
                handleCloseButton();
            }
        });
    }

    const submitProduct = () => {
        // Add shop id here to the object
        // console.log('submit product called ==> ',mode, productForm);
        if (mode === 'add') {
            createProduct();
        } else {
            editProduct();
        }
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        const res = await uploadImageToCloud(dispatch, e.target.files[0]);
          // console.log(res.data.secure_url);
        const {data: {secure_url}} = res;
        if (secure_url) {
            dispatch(setToast({
                type: 'success',
                message: 'User image uploaded successfully!'
            }));
        }
        const tempForm = {...productForm};
        tempForm.photo_url = secure_url;
        setProductForm(tempForm);
    };

    const onProductFormChange = (e) => {
        const fieldName = e.target.getAttribute('id');
        const tempForm = {...productForm};
        tempForm[fieldName] = e.target.value;
        setProductForm(tempForm);
    }

    const createNewCategory = () => {
        addNewCategory(dispatch, { shop_id: shopDetails._id, name: newCategory }, (err, successFlag) => {
            if (successFlag) {
                setShowNewCategory(false);
                setNewCategory('');
            }
        });
    }

    return (
        <div className="container">
            <Modal show={showFlag} onHide={handleCloseButton}>
                <Modal.Header closeButton>
                    <Modal.Title>{mode && mode === 'edit' ? 'Modify Product' : 'Add product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="user_details">
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="name"
                            aria-describedby="name"
                            value={productForm.name}
                            onChange={onProductFormChange}
                          />
                        <Form.Label htmlFor="image">Image</Form.Label>
                        <Form.Control
                            type="file"
                            id="image"
                            aria-describedby="image"
                            onChange={uploadImage}
                          />
                        <Form.Label htmlFor="photo_url">Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            id="photo_url"
                            aria-describedby="photo_url"
                            value={productForm.photo_url}
                            disabled={true}
                          />
                        <Form.Label htmlFor="description">Description</Form.Label>
                        <Form.Control
                            type="text"
                            id="description"
                            aria-describedby="description"
                            value={productForm.description}
                            onChange={onProductFormChange}
                          />
                        <Form.Label htmlFor="category">Category</Form.Label>
                        <Row>
                            <Col xs={showNewCategory ? 12 : 9}>
                                <Form.Select aria-label="Select category" id="category_id" value={productForm.category_id} onChange={onProductFormChange}>
                                    <option>Select One</option>
                                    {categories && categories.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
                                </Form.Select>
                            </Col>
                            {!showNewCategory ? <Col xs={3}>
                                <Button variant="success" onClick={() => setShowNewCategory(!showNewCategory)}>Add New</Button>
                            </Col>: ''}
                        </Row>
                        {
                            showNewCategory ? 
                                <Row>
                                <Form.Label htmlFor="new_category">New Category</Form.Label>
                                <Col xs={8}>
                                    <Form.Control
                                        type="text"
                                        id="new_category"
                                        aria-describedby="new_category"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                      />
                                </Col>
                                <Col xs={4}>
                                    <Button variant="success" onClick={() => createNewCategory()}>Add</Button>
                                    <Button style={{marginLeft: '5px'}} variant="danger" onClick={() => setShowNewCategory(!showNewCategory)}>Cancel</Button>
                                </Col>
                                </Row> : ''
                        }
                        <Form.Label htmlFor="price">Price</Form.Label>
                        <Form.Control
                            type="text"
                            id="price"
                            aria-describedby="price"
                            value={productForm.price}
                            onChange={onProductFormChange}
                          />
                        <Form.Label htmlFor="qty">Stock Available Qty</Form.Label>
                        <Form.Control
                            type="text"
                            id="qty"
                            aria-describedby="qty"
                            value={productForm.qty}
                            onChange={onProductFormChange}
                          />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseButton()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => submitProduct()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AddProduct;