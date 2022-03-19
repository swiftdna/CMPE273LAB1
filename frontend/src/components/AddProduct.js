import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Spinner, InputGroup, Button, FormControl, Badge, Modal, Form } from 'react-bootstrap';
import { addProduct, uploadImageToCloud, getProductCategories } from '../utils';
import { setToast } from '../actions/app-actions';
import { selectShopCategories } from '../selectors/shopSelector';


function AddProduct({data, showFlag, fn}) {
    const dispatch = useDispatch();
    const categories = useSelector(selectShopCategories);
    const [productForm, setProductForm] = useState({
        name: '',
        image_url: '',
        description: '',
        price: '',
        qty: ''
    });

    useEffect(() => {
        getProductCategories(dispatch);
    }, [data]);

    const submitProduct = () => {
        // Add shop id here to the object
        console.log('submit product called ==> ', productForm);
        const productObj = {...productForm};
        productObj.shop_id = data.id;
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
        })
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

    return (
        <div className="container">
            <Modal show={showFlag} onHide={fn && fn.handleAddProductClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add product</Modal.Title>
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
                        <Form.Select aria-label="Select category" id="category_id" value={productForm.category} onChange={onProductFormChange}>
                            <option>Select One</option>
                            {categories && categories.map(category => <option value={category.id}>{category.name}</option>)}
                        </Form.Select>
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
                    <Button variant="secondary" onClick={fn && fn.handleAddProductClose}>
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