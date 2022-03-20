import React, { useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaRegHeart, FaHeart, FaPencilAlt } from 'react-icons/fa';

function Products({ data, loading, extras, fn, flags, disabled }) {
    
    const {favs, userObj, currency} = extras ? extras : {};
    const isFav = (id) => {
        return favs && favs.length && favs.indexOf(id) !== -1;
    };

    const processClicks = (e, dispatch, functionName, params) => {
        e.stopPropagation();
        if (fn && fn[functionName] && dispatch) {
            fn[functionName](dispatch, params.id, params.data);
        }
    };

    const isDisabled = (feature) => {
        return disabled && disabled.length && disabled.indexOf(feature) !== -1;
    }

    return(
        <div className="container main-frame">
            {
                loading && <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            {
                data && data.length ? 
                data.map(product => <Card key={product.id} className="product-card" style={{ width: '18rem', cursor: 'pointer', flex: '1 0 21%', margin: '5px' }} onClick={() => fn && fn.openProduct(product.id)}>
                  <Card.Img style={{objectFit: 'cover', width: '300px', height: '200px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} variant="top" src={product.photo_url} />
                  <Card.Body>
                    <Card.Title>{product.name}
                        <Badge pill bg="success" style={{ position: 'absolute', right: '5px', fontSize: '13px' }}>
                          {currency} {product.price}
                        </Badge>
                    </Card.Title>
                    {/* <Card.Text>
                      {product.description}
                    </Card.Text> */}
                    {product.shop_details && product.shop_details.name ? <Card.Text style={{"margin":"0","marginTop":"-10px","fontSize":"12px","color":"#808080"}} onClick={(e) => processClicks(e, fn.dispatch, 'openShop', {id: product.shop_id, data: userObj})}>
                      {product.shop_details.name}
                    </Card.Text> : '' }
                    {product && product.salesCount ? <Card.Text style={{"margin":"0","marginTop":"0px","fontSize":"12px","color":"#808080"}}>
                      {product.salesCount} sold
                    </Card.Text> : '' }
                    <div className="button_panel">
                        {!isDisabled('cart') ? <FaShoppingCart className="card-btn" style={{color: '#0070BA'}} title="Add to Cart" size="1.5em" onClick={(e) => processClicks(e, fn.dispatch, 'addToCart', {id: product, data: userObj})} /> : '' }
                        {!isDisabled('edit') ? <FaPencilAlt className="card-btn" style={{color: '#0070BA'}} title="Edit Product" size="1.5em" onClick={(e) => processClicks(e, fn.dispatch, 'editProduct', { id: product })} /> : '' }
                        {flags && flags.isLoggedIn && 
                            (isFav(product.id) ? <FaHeart className="card-btn" style={{color: '#cc0000'}} title="Favourites" size="1.5em" onClick={(e) => processClicks(e, fn.dispatch, 'unfavourite', {id: product.id, data: userObj})} /> :
                                <FaRegHeart className="card-btn" style={{color: '#cc0000'}} title="Favourites" size="1.5em" onClick={(e) => processClicks(e, fn.dispatch, 'favourite', {id: product.id, data: userObj})} />)}
                    </div>
                  </Card.Body>
                </Card>
                ) : ''
            }
        </div>
    )
}

export default Products;