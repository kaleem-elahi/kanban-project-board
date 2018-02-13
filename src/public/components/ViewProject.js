import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';
import { fetchProjects, fetchLanesAction, selectedProjectActionF, setAddList } from '../actions/auth/auth_actions';
import { Button, Modal } from 'react-bootstrap';
// Redux Form
import { Field, reduxForm, Form } from 'redux-form';
//Board Container
import BoardContainer from './commonComponent/boardContainer';
import Header from './commonComponent/header';


class ViewProject extends Component {
	constructor(props) {
		super();
		this.state = {
			showCreateProjectModal: false,
			showModal: false,
			uploadedImages: [],
			existingImages: [],
			profileImages: []
		};
		this.formList = this.formList.bind(this);
	}
	showModal() {
		this.setState({ showModal: true });
	}

	/**
	 * On load of loading page, check if user is logged in, put to dashboard,
	 * Start auth listener too, so if user logs in with other tab put them to dashboard
	 *
	 * @memberof Login
	 */
	componentWillMount() {
		let selectedProjectId = localStorage.getItem("selectedProjectId");
		let authUserId = this.props.auth.data ? this.props.auth.data.uid : "";

		selectedProjectId = JSON.parse(selectedProjectId);
		let p = this.props.selectedProject || [];
		let toSearch = window.location.href.split('/')[5];
		this.props.fetchProjects(authUserId);
		this.props.fetchLanesAction(toSearch, authUserId);
		this.props.selectedProjectActionF(p || selectedProjectId.projectId || toSearch, authUserId); // save state
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
                  
                    <Button type='submit' form='createNewProjectBoardForm'  bsStyle="success">Create Project</Button>
                </Modal.Footer>
            </Modal>
		);
	}

	// Input Render Fields
	renderField(field) {
		const { touched, error } = field.meta;
		const conditionalClassName = ` ${touched && error ? 'has-error' : ''}`;
		if (field.type === "text" || field.type === "number") {
			return (<div className={conditionalClassName}>
                <div className={` ${field.className ? field.className : ' '}`}>
                <label htmlFor={`input-${field.id}`} className={` col-sm-12 col-form-label ${field.label ? '' : 'hide'}`}>{field.label}</label>
                    <input type={field.type} className="form-control" id={`input-${field.id}`}   placeholder={field.placeholder} {...field.input} />
                    <div className="help-block help-block-new">
                        {touched ? error : ''}
                    </div>
                </div>
            </div>);
		}
	}

	// Submit function of redux-form
	onSubmitForCNPForm = (values) => {
		let authUserId = this.props.auth.data.uid || "";

		let toSearch = window.location.href.split('/')[5];
		this.props.setAddList(toSearch, values.listName, this.props.fetchLanes || [], authUserId);
		this.props.reset();

		if (values) {
			//   alert("Something went correct!!");
		} else {
			alert('Something went wrong...')
		}
	}

	// Form For Modal
	formList = () => {
		return (<div className="project--list-create" > 
      <Form  id='createListForm' onSubmit={this.props.handleSubmit(this.onSubmitForCNPForm)}>
        <div className="row">
            <Field type="text" id="listName" className="" name="listName" placeholder="Lane Name" component={this.renderField}  />
        </div>
        <div className="row">
            <button type="submit" className={'btn btn-primary btn-sm'}   > Submit </button>
        </div>
    </Form></div>);
	}

	render() {

		let selectedProject = this.props.selectedProject || localStorage.getItem("selectedProjectId")
		const data = this.props.fetchLanes || [];
		return (
			<div>
            <Notifications notifications={this.props.notifications}/>
            <Header projectTitle={selectedProject ? this.props.selectedProject.projectTitle : "not available.."}/>
			{
				this.props.auth.isLoading === true ? <div className="loader"></div>
			:
			<div className='container'>
                <div className="col-sm-12">
                    <hr/>             	
						 <BoardContainer
						 sendData={data}  
						 NewForm={this.formList()} />
                    <br/>
                    <br/>
                </div>
            </div>
			}
        </div>
		);
	}
}

// Validation of Inputs 
const validate = (values, props) => {
	const errors = {};
	if (!values.listName) {
		errors.listName = "Lane name is required.";
	}
	return errors;
};

export default reduxForm({ form: 'createListForm', validate })(connect(state => ({
	state,
	notifications: state.notifications,
	auth: state.Auth,
	profile_image: state.Auth.profile_image,
	isLoggedin: state.Auth.data,
	projects: state.Auth.projectsData,
	selectedProject: state.Auth.selectedProject || [],
	fetchLanes: state.Auth.fetchLanes
}), {
	selectedProjectActionF,
	setAddList,
	fetchLanesAction,
	fetchProjects

})(ViewProject));
