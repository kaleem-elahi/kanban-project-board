import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import firebase from 'firebase';
import Notifications from 'react-notification-system-redux';
import { fetchProjects, addProjectName, saveProfileImage, checkAuthStatus, deleteProfileImage, logout, fetchUsers, showNotification } from '../../actions/auth/auth_actions';
import { auth } from '../../../config/firebase_config';
import { Nav, NavDropdown, MenuItem, Button, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Header extends Component {
	constructor(props) {
		super();
		this.state = {
			showCreateProjectModal: false,
			showModal: false,
			uploadedImages: [],
			existingImages: [],
			profileImages: []
		};
		this.onImageDrop = this
			.onImageDrop
			.bind(this);
		this.saveImages = this
			.saveImages
			.bind(this);
		this.onSubmit = this
			.onSubmit
			.bind(this);

	}
	showModal() {
		this.setState({ showModal: true });
	}
	showCreateProjectModal(val) {
		this.setState({ showCreateProjectModal: val });
	}
	/**
	 * If user has logged in on other tab, put them to dashboard
	 *
	 * @memberof Login
	 */
	handleLoggedInState() {
		this.props.history.push("/");
	}
	/**
	 * If user is not logged in, start auth listener
	 */
	startAuthListener() {
		const unsubscribeAuthListener = auth()
			.onAuthStateChanged((user) => {
				if (!user) {
					this.handleLoggedInState();
				}
			});
		if (!unsubscribeAuthListener) {
			this.handleLoggedInState();
		}
	}

	/**
	 * On load of loading page, check if user is logged in, put to dashboard,
	 * Start auth listener too, so if user logs in with other tab put them to dashboard
	 *
	 * @memberof Login
	 */
	componentWillMount() {
		this.props.checkAuthStatus()
			.then(() => {
				const user = this.props.auth.data;
				if (user && user.uid) {
					if (user.photoURL && user.photoURL !== "") {
						this.setState({ existingImages: [user.photoURL] });
					}
				} else {
					this.startAuthListener();
				}

			})
			.catch(() => {
				this.startAuthListener();
			});

		this.props.fetchUsers();

		this.props.fetchProjects();
	}

	/*
	 * logout 
	 */
	logout() {
		this.props.logout();
		this.props.history.push("/");
	}
	/**
	 * Randomize file name so we can upload files with same name in same bucket
	 *
	 * @param {any} name
	 * @returns
	 * @memberof profile
	 */
	randomizeFilename(name) {
		const extension = name
			.split(".")
			.pop() || "jpg";
		return (Math.random()
				.toString(36) + '00000000000000000')
			.slice(2, 10 + 2) + "." + extension;
	}
	/**
	 * On selection of product image
	 *
	 * @param {any} files
	 * @memberof profile
	 */
	onImageDrop(files) {
		const { profileImages } = this.state;
		const addedImages = profileImages.length;
		if (addedImages >= 1) {
			this.setState({ maxImagesAdded: true });
			this
				.props
				.showNotification("Message", "Sorry, only " + 1 + " images allowed per user", true);
		} else {
			let allowed = 1;
			if (files.length < allowed)
				allowed = files.length;
			if (addedImages >= 5) {
				this.setState({ maxImagesAdded: true });
				this
					.props
					.showNotification("Message", "Sorry, only " + 1 + " images allowed per user", true);
				return;
			}
			const filesToPush = [];
			if (allowed > 0) {
				for (let i = 0; i < allowed; i++) {
					files[i].fileName = this.randomizeFilename(files[i].name);
					filesToPush.push(files[i]);
				}
				this.setState({
					profileImages: profileImages ?
						this
						.state
						.profileImages
						.concat(filesToPush) : filesToPush
				});
			}
		}
	}

	/**
	 * Remove image from state based on supplied index
	 *
	 * @param {any} index
	 * @memberof profile
	 */
	removeProfileImage(index, existing) {
		if (window.confirm("Are you sure you want to remove this image from product images?")) {
			const { profileImages, existingImages } = this.state;
			const images = existing ?
				existingImages :
				profileImages;
			const itemToDelete = images.splice(index, 1)[0];
			if (existing) {
				const toDelete = this.state.existingImagesToDelete || [];
				toDelete.push(itemToDelete);
				this.props.deleteProfileImage();
				this.setState({ existingImages: images, existingImagesToDelete: toDelete });
			} else
				this.setState({ productImages: images });
			const addedImages = profileImages.length + existingImages.length;
			if (addedImages >= 1) {
				this.setState({ maxImagesAdded: true });
			} else {
				this.setState({ maxImagesAdded: false });
			}
		}
	}
	/**
	 * Save profile images, key for user id is provided
	 *
	 * @param {any} key
	 * @param {any} props
	 * @returns
	 * @memberof profile
	 */
	saveImages() {
		const key = this.props.auth.data.uid;
		if (key) {
			let uploaded = 0;
			const images = this.state.profileImages;
			if (images.length > 0) {
				const saveImage = () => {
					if (uploaded < images.length) {
						const curFile = images[uploaded];
						this
							.props
							.saveProfileImage({ id: key, name: curFile.fileName, file: curFile })
							.then(() => {
								uploaded++;
								const curImage = curFile.fileName;
								const stateImages = this.state.uploadedImages;
								stateImages.push(curImage);
								this.setState({ uploadedImages: stateImages });
								this.setState({ existingImages: [curFile.preview] });
								saveImage();
							});
						this.setState({ uploadingImageIndex: uploaded });
					} else {
						this.setState({ uploadingImageIndex: null, isLoading: null, showModal: false });
						this
							.props
							.showNotification("Success", "User profile saved successfully");
					}
				};
				saveImage();
			} else {
				this
					.props
					.showNotification("Error", "Please select image.", true);
			}
		}
	}
	/**
	 * On submit of the form
	 *
	 * @param {any} props
	 * @memberof NewProduct
	 */
	onSubmit(props) {
		this.saveImages();
	}
	/**
	 * Format name of item in table, to add link to edit screen
	 *
	 * @param {any} cell
	 * @param {any} row
	 * @returns
	 * @memberof UsersList
	 */
	nameFormatter(cell, row) {
		const self = (row.id === auth()
			.currentUser.uid) ? 'self' : '';
		return (
			<span>{cell} <label className="label btn-warning">{self}</label></span>
		);
	}

	/**
	 * Format name of item in table, to add link to edit screen
	 *
	 * @param {any} cell
	 * @param {any} row
	 * @returns
	 * @memberof UsersList
	 */
	imageFormatter(cell, row) {
		return (
			<span className='profile-list-thumb'> <img src={cell}/> </span>
		);
	}
	/**
	 * Format name of item in table, to add link to edit screen
	 *
	 * @param {any} cell
	 * @param {any} row
	 * @returns
	 * @memberof UsersList
	 */
	dateFormatter(cell, row) {
		return (
			<span>{moment(cell).format('Y/M/D hh:mm:ss A')}</span>
		);
	}

	render() {
		// console.log(this.state, "CHECKKKKKKKKKKINGSTATE");
		const { handleSubmit, pristine, submitting, isLoggedin, auth } = this.props;
		const existingImages = this.state.existingImages;
		// console.log(existingImages);
		const users = (auth.users) ? auth.users : [];
		let hideModal = () => this.setState({ showModal: false });
		const data = _.map(users, (user, key) => {
			let fullName;
			let photoURL;
			if (user.profile) {
				if (!user.photoURL) {
					if (user.profile.photoURL) {
						photoURL = user.profile.photoURL;
					} else {
						photoURL = 'https://image.flaticon.com/icons/svg/181/181549.svg';
					}
				} else {
					photoURL = user.photoURL;
				}
				fullName = (user.profile.fname) ? user.profile.fname : user.profile.displayName;
			}
			return {
				...user,
				...user.profile,
				full_name: fullName,
				photoURL: photoURL,
				id: key
			}
		});
		let imageUploadPerc = this.props.product_image && this.props.product_image ?
			Math.round((this.props.product_image.bytesTransferred * 100) / this.props.product_image.totalBytes) :
			20;
		const displayName = (isLoggedin && isLoggedin.displayName) ? isLoggedin.displayName : "";



		return (
			<div>
                        <Notifications notifications={this.props.notifications}/>
                        <nav className="navbar navbar-default navbar-static-top">
                            <div className="container">
                                <div className="navbar-header">
                                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                                        <span className="sr-only">Toggle Navigation</span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                    <a className="navbar-brand" href="javascript:void(0);"> 
                                    </a>
                                </div>
                                <div className="collapse navbar-collapse" id="app-navbar-collapse">
                                    <ul className="nav navbar-nav">
                                        <li><a href="/#/dashboard"><h4><i className="fa fa-hashtag"></i>projectBoard</h4> </a></li>
                                    </ul>
                                    <Nav className="navbar-nav pull-right">
                                        <NavDropdown eventKey={3} title={displayName} id="basic-nav-dropdown">
                                          <MenuItem onClick={this.showModal.bind(this)} eventKey={3.1} >Profile</MenuItem>
                                          <MenuItem onClick={this.logout.bind(this)} eventKey={3.1} >Logout</MenuItem>
                                        </NavDropdown>
                                    </Nav>
                                </div>
                            </div>
                        </nav>

                       
                        <Modal 
                        show={this.state.showModal}
                        onHide={hideModal}
                        aria-labelledby="contained-modal-title"
                        bsSize="small">
                            <Modal.Header closeButton>
                              <Modal.Title id="contained-modal-title-sm">Profile</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                (existingImages.length < 1) ? 
                                <Dropzone
                                    accept="image/*"
                                    className="drop-zone"
                                    activeClassName="active"
                                    onDrop={this.onImageDrop}>
                                    <p>Drop images to upload, or click here to select files to upload.</p>
                                    <p>Only images will be accepted</p>
                                </Dropzone>
                                : null
                                }
                                {this.state.profileImages.length > 0 && existingImages.length < 1
                                        ? <div>
                                                <h4 className="text-left">Selected {this.state.profileImages.length}
                                                    {' '}
                                                    images to upload :</h4>
                                                <hr/>
                                                <div className="profile-image-container">
                                                    {this
                                                        .state
                                                        .profileImages
                                                        .map((file, i) => <div
                                                            onClick={() => {
                                                            this.removeProfileImage(i)
                                                        }}
                                                            key={i}
                                                            className="profile-image">
                                                            {this.state.uploadingImageIndex === i
                                                                ? <div className="progress-overlay">
                                                                        <div className="progress">
                                                                            <div
                                                                                className="progress-bar progress-bar-striped active"
                                                                                role="progressbar"
                                                                                aria-valuenow={imageUploadPerc}
                                                                                aria-valuemin={0}
                                                                                aria-valuemax={100}
                                                                                style={{
                                                                                width: imageUploadPerc + '%'
                                                                            }}>
                                                                                {imageUploadPerc}%
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                : null}
                                                            <img alt='profile {i+1}' className='upload-img-preview' src={file.preview}/>
                                                        </div>)}
                                                </div>
                                            </div>
                                        : null}
                                        {existingImages.length > 0
                                        ? <div>
                                                <div className="profile-image-container">
                                                    {existingImages.map((file, i) => <div
                                                        onClick={() => {
                                                        this.removeProfileImage(i, true)
                                                    }}
                                                        key={i}
                                                        className="profile-image">
                                                        <img alt='Product {i+1}' className='upload-img-preview' src={file}/>
                                                    </div>)}
                                                </div>
                                            </div>
                                        : null
                                    }
                            </Modal.Body>
                            <Modal.Footer>
                              <Button onClick={this.onSubmit} className="btn btn-primary">Submit</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
		);
	}
}


// Validation of Inputs 
const validate = (values, props) => {
	// console.log(this.state, "STATE::::");

	// console.log(values);
	const errors = {};
	if (!values.projectTitle) {
		errors.projectTitle = "Project title is required.";
	}
	return errors;
};


// Map state to props
const mapStateToProps = (state, props) => ({
	notifications: state.notifications,
	auth: state.Auth,
	profile_image: state.Auth.profile_image,
	isLoggedin: state.Auth.data,
	projects: state.Auth.projectsData
});


export default withRouter(connect(mapStateToProps, {
	addProjectName,
	deleteProfileImage,
	saveProfileImage,
	showNotification,
	checkAuthStatus,
	logout,
	fetchUsers,
	fetchProjects
})(Header));
