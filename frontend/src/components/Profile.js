import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchProfile, updateProfile, uploadImageToCloud, getCountries } from '../utils';
import { selectIsLoggedIn, selectUser, selectCountries } from '../selectors/appSelector';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData } from '../selectors/profileSelector';
import { FaPencilAlt, FaSave } from 'react-icons/fa';
import { setToast } from '../actions/app-actions';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';

export default function Profile() {
	const dispatch = useDispatch();
    const userObj = useSelector(selectUser);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const userProfile = useSelector(selectProfileData);
    const countries = useSelector(selectCountries);
    const [editMode, setEditMode] = useState(false);
    const [userProfileForm, setUserProfileForm] = useState(userProfile);
    const [userImage, setUserImage] = useState();

	useEffect(() => {
		if (isLoggedIn) {
        	fetchProfile(dispatch, userObj);
        	getCountries(dispatch);
		}
    }, [isLoggedIn]);

    useEffect(() => {
    	if (userProfile) {
    		setUserProfileForm(userProfile);
    	}
    }, [userProfile]);

    const onUserProfileChange = (e) => {
    	const fieldName = e.target.getAttribute('id');
        const tempForm = {...userProfileForm};
        tempForm[fieldName] = e.target.value;
        setUserProfileForm(tempForm);
    };

    const reset = () => {
    	setUserProfileForm(userProfile);
    };

    const getCountryName = (code) => {
    	if (!countries || !countries.length) {
    		return code;
    	}
    	const filteredCountryArr = countries.filter(cntry => cntry.code === code);
    	return filteredCountryArr && filteredCountryArr.length && filteredCountryArr[0].name;
    }

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
		const tempForm = {...userProfileForm};
		tempForm.dp_url = secure_url;
		setUserProfileForm(tempForm);
    }

    const submitProfile = () => {
    	console.log('userProfileForm -> ' , userProfileForm);
    	// const {id: userID} = userProfile;
		updateProfile(dispatch, userProfileForm, (err, successFlag) => {
			if (successFlag) {
				setEditMode(false);
			}
		});
    };

	return (
        <div className="container pull-down fill-page">
			<h5>{userProfile.name ? userProfile.name : 'User'}'s profile {!editMode ? 
				<FaPencilAlt className="edit_icon" size="1em" onClick={() => setEditMode(!editMode) } /> :
				<FaSave className="edit_icon" size="1em" onClick={() => submitProfile() } />}
			</h5>
			<div className="user_details">
				<Row>
					<Col xs="3">
						<Image src={userProfileForm.dp_url} roundedCircle={true} style={{objectFit: 'cover', width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />
					</Col>
					<Col>
						{editMode ?
							<>
							<Form.Label className="form_label" htmlFor="image">User Image</Form.Label>
							<Form.Control
							    type="file"
							    id="image"
							    aria-describedby="image"
							    onChange={uploadImage}
							  />
							</> : ''}
						<Form.Label className="form_label" htmlFor="name">Name</Form.Label>
						{!editMode ? <p>{userProfileForm.name}</p> : 
							<Form.Control
							    type="text"
							    id="name"
							    aria-describedby="name"
							    value={userProfileForm.name}
							    onChange={onUserProfileChange}
							  />
						}
						<Form.Label className="form_label" htmlFor="dob">Date of Birth</Form.Label>
						{!editMode ? <p>{userProfileForm.dob}</p> : 
							<Form.Control
							    type="text"
							    id="dob"
							    aria-describedby="name"
							    value={userProfileForm.dob}
							    onChange={onUserProfileChange}
							  />
						}
						<Form.Label className="form_label" htmlFor="address1">Address Line 1</Form.Label>
						{!editMode ? <p>{userProfileForm.address1}</p> : 
							<Form.Control
							    type="text"
							    id="address1"
							    aria-describedby="address1"
							    value={userProfileForm.address1}
							    onChange={onUserProfileChange}
							  />
						}
						<Form.Label className="form_label" htmlFor="name">City</Form.Label>
						{!editMode ? <p>{userProfileForm.city}</p> : 
							<Form.Control
							    type="text"
							    id="city"
							    aria-describedby="city"
							    value={userProfileForm.city}
							    onChange={onUserProfileChange}
							  />
						}
						<Form.Label className="form_label" htmlFor="state">State</Form.Label>
						{!editMode ? <p>{userProfileForm.state}</p> : 
							<Form.Control
							    type="text"
							    id="state"
							    aria-describedby="state"
							    value={userProfileForm.state}
							    onChange={onUserProfileChange}
							  />
						}
						<Form.Label className="form_label" htmlFor="country">Country</Form.Label>
						{!editMode ? <p>{getCountryName(userProfileForm.country)}</p> : 
							<Form.Select aria-label="Select currency" id="country" value={userProfileForm.country} onChange={onUserProfileChange}>
		                      <option>Select One</option>
		                      {countries && countries.map(country => <option value={country.code}>{country.name}</option>)}
		                    </Form.Select>
						}
						<Form.Label className="form_label" htmlFor="dp_url">Picture URL</Form.Label>
						{!editMode ? <p>{userProfileForm.dp_url}</p> : 
							<Form.Control
							    type="text"
							    id="dp_url"
							    aria-describedby="dp_url"
							    disabled={true}
							    value={userProfileForm.dp_url}
							  />
						}
						{editMode ? <div className="btn_panel">
							<Button variant="secondary" onClick={() => reset()}>
		                        Reset
		                    </Button>
		                    <Button variant="primary" onClick={() => submitProfile()}>
		                        Save Changes
		                    </Button>
						</div> : ''}
					</Col>
				</Row>
			</div>
        </div>
	);
}