import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import firebase from 'firebase';
import Notifications from 'react-notification-system-redux';
import { selectedProjectActionF, fetchProjects, addProjectName, saveProfileImage, checkAuthStatus, deleteProfileImage, logout, fetchUsers, showNotification } from '../actions/auth/auth_actions';
import { auth } from '../../config/firebase_config';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './commonComponent/header';
// Redux Form
import { Field, reduxForm } from 'redux-form';


class Dashboard extends Component {
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

		// this.selectProject = this.selectProject.bind(this);
		this.formForModal = this.formForModal.bind(this);
		// this.selectProject = this.selectProject.bind(this);
		// this.handleModalShow = this.handleModalShow.bind(this);
		// this.handleModalClose = this.handleModalClose.bind(this);
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
		this
			.props
			.history
			.push("/");
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
		let authUserId = this.props.auth.data ? this.props.auth.data.uid : "";

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
		this.props.fetchProjects(authUserId);
	}

	// componentWillReceiveProps(nextProps) {
	// 	let authUserId = this.props.auth.data ? this.props.auth.data.uid : "";

	// 	if (this.props.auth !== nextProps.auth) {
	// 		this.props.fetchProjects(authUserId);
	// 	}
	// }

	/*
	 * logout 
	 */
	logout() {
		this.props.logout();
		// this
		//   .props
		//   .history
		//   .push("/");
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

	// Modal popup for create new project

	renderModalForm(title, bodyComponent, footerComponent) {
		return (
			<Modal show={this.state.showCreateProjectModal} onHide={this.showCreateProjectModal.bind(this,false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bodyComponent}
                    </Modal.Body>
                    <Modal.Footer>
                    {/* <Button >Close</Button> */}
                    <Button type='submit' form='createNewProjectBoardForm'  bsStyle="success">Create Project</Button>
                </Modal.Footer>
            </Modal>
		)
	}

	// input render fields

	renderField(field) {
		const { touched, error } = field.meta;
		const conditionalClassName = ` ${touched && error ? 'has-error' : ''}`;
		if (field.type == "text" || field.type == "number") {
			return (
				<div className={conditionalClassName}>
                <div className={` ${field.className ? field.className : ' form-group'}`}>
                <label htmlFor={`input-${field.id}`} className={`col-md-10 col-form-label ${field.label ? '' : 'hide'}`}>{field.label}</label>
                    <input type={field.type} className="form-control" id={`input-${field.id}`}   placeholder={field.placeholder} {...field.input} />
                    <div className="help-block help-block-new">
                        {touched ? error : ''}
                    </div>
                </div>
            </div>
			);
		} else if (field.type == "checkbox") {
			return (
				<div><span>{field.outerLabel ? field.outerLabel : ""}</span>
                <input type={field.type} className={field.className ? field.className : ""} id={`checkbox-${field.id}`} {...field.input} />
                <label htmlFor={`checkbox-${field.id}`}>{field.label}</label>
            </div>
			)
		}
	}


	//Submit function of redux form

	onSubmitForCNPForm = (values) => {
		console.log(values);
		this.showCreateProjectModal(false);
		this.props.addProjectName(this.props.auth.data.uid, { ...values });
		this.props.reset();
		if (values) {
			//   alert("Something went correct!!");
		} else {
			alert('Something went wrong...')
		}
	}


	// Form 

	formForModal = () => {
		// const {handleSubmit, pristine, submitting} = this.props;
		console.log("In the function...");
		return (
			<form id='createNewProjectBoardForm' onSubmit={this.props.handleSubmit(this.onSubmitForCNPForm)}>
        <div className="row">
            <Field type="text" id="projectTitle" className="col-md-12" name="projectTitle" placeholder="Project Title" component={this.renderField} label={'Project title'} />
            <Field type="text" id="projectDescription" className="col-md-12" name="projectDescription" placeholder="Project Description" component={this.renderField} label={'Project Description'} />
        </div>
    </form>)
	}

	selectProject = (projects, key) => {
		let authUserId = this.props.auth.data.uid || "";

		console.log(projects, "project-data");
		console.log(key, "project-key");
		let objSelectedProject = {
			projectId: key
		}
		// let objSelectedProject = {
		// 	projectId: key,
		// 	projectData: projects
		// }
		console.log(objSelectedProject, "both");
		this.props.selectedProjectActionF(objSelectedProject, authUserId);
		localStorage.setItem("selectedProjectId", JSON.stringify(objSelectedProject));
	}

	// render PROJECTS

	renderProjects = () => {
		let foo = this.props.projects || {};
		const result = Object.keys(foo)
			.map((key, i) => {
				return (<div className="col-sm-2" key={i} >
                 <Link to={`/viewproject/`+key} onClick={this.selectProject.bind(this,foo[key],key)} >
								  <div className="project--board"> <div className="big">{foo[key].projectTitle} </div>
                  {foo[key].projectDescription ? <div className="small"> {"- " + foo[key].projectDescription} </div> : <div className="small">(No Description)</div>}
                </div></Link>
			</div>);
			});
		return result;
	}


	render() {
		const existingImages = this.state.existingImages;
		let hideModal = () => this.setState({ showModal: false });

		let imageUploadPerc = this.props.product_image && this.props.product_image ?
			Math.round((this.props.product_image.bytesTransferred * 100) / this.props.product_image.totalBytes) :
			20;




		return (
			<div>
                        <Notifications notifications={this.props.notifications}/>
                        <Header/>

                        <div className='container'>
                            <div className="col-lg-12">
                                <h4>Projects</h4>
                                <hr/>
                                <div className="row">
                                {this.renderProjects()}
                                <div className="col-sm-2">
                                    <div className="project--board-create" onClick={this.showCreateProjectModal.bind(this,true)}> Create  new Project.. </div>
                                   {this.renderModalForm("Create a new project",this.formForModal())}            
                                	</div>
                              </div>
                            <hr/>
                            </div>
                        </div>
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
	console.log(this.state, "STATE::::");

	console.log(values);
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



export default reduxForm({ form: 'createNewProjectBoardForm', enableReinitialize: true, validate })(connect(mapStateToProps, {
	selectedProjectActionF,
	addProjectName,
	deleteProfileImage,
	saveProfileImage,
	showNotification,
	checkAuthStatus,
	logout,
	fetchUsers,
	fetchProjects
})(Dashboard));
