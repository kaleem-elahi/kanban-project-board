import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm, Form } from 'redux-form';
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import { addCardAction, setSelectedLaneIdAction } from '../../actions/auth/auth_actions';


const style = {
	border: '1px dashed #bbbbbb',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: '#80808040',
	cursor: 'move',
}

const listSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const listTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem()
			.index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component)
			.getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveLane(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem()
			.index = hoverIndex
	},
}

@DropTarget(ItemTypes.LIST, listTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))

@DragSource(ItemTypes.LIST, listSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
class List extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isInputMode: false,
			currentLane: ""
		}
		// this.toggleIsInputMode = this.toggleIsInputMode.bind(this);
	}

	toggleIsInputMode(boolean, laneKey) {

		let laneKeyV = laneKey || "";
		this.setState({
			isInputMode: boolean,
			currentLane: laneKeyV
		})

		// setSelectedLaneIdAction for comparing add card.
		this.props.setSelectedLaneIdAction(laneKeyV)
	}




	// Input Render Fields
	renderField(field) {
		const { touched, error } = field.meta;
		const conditionalClassName = ` ${touched && error ? 'has-error' : ''}`;
		if (field.type == "text" || field.type == "number") {
			return (<div className={conditionalClassName}>
                <div className={` ${field.className ? field.className : ' '}`}>
                <label htmlFor={`input-${field.id}`} className={` col-sm-12 col-form-label ${field.label ? '' : 'hide'}`}>{field.label}</label>
                    <input type={field.type} className="form-control input-sm" id={`input-${field.id}`}   placeholder={field.placeholder} {...field.input} />
                    <div className="help-block help-block-new">
                        {touched ? error : ''}
                    </div>
                </div>
            </div>);
		} else if (field.type === "textarea") {
			return (
				<div className={conditionalClassName}>
				<div>
					<span>{field.outerLabel ? field.outerLabel : ""}</span>
              	<textarea   className={` form-control input-sm ${field.className ? field.className : ''}`} id={`textarea-${field.id}`} {...field.input} ></textarea>
                <label htmlFor={`textarea-${field.id}`} className={` col-sm-12 col-form-label ${field.label ? '' : 'hide'}`}>{field.label}</label>
								<div className="help-block help-block-new">
                        {touched ? error : ''}
                    </div>
  		  </div>
  		  </div>
			)
		}
	}

	//Submit function of redux form
	onSubmitForCNPForm = (keyId, values) => {
		let authUserId = this.props.auth.data.uid || "";

		let toSearch = localStorage.getItem("selectedProjectId");
		toSearch = JSON.parse(toSearch);
		this.props.addCardAction(toSearch.projectId, keyId, values, authUserId);
		this.props.reset();
	}

	// Form For Modal
	formList = (keyId) => {
		// const {handleSubmit, pristine, submitting} = this.props;
		// console.log("In the function...");
		return (<div className="card-create" > 
      <Form  id={'createCardForm'} onSubmit={this.props.handleSubmit(this.onSubmitForCNPForm.bind(this,keyId))}>
        <div className="row">
            <Field type="text" id="cardTitle" className="" name="cardTitle" placeholder="Card Title" component={this.renderField}  />
            <Field type="textarea" id="description" className="" name="description" placeholder="Description" component={this.renderField}  />
					
        </div>
        <div className="row">
					<input type="submit" className="btn btn-primary btn-sm" disabled={this.state.isSaveDisabled} value="Save" /> &nbsp;
					<input type="button" className="btn btn-default btn-sm" value="Cancel"  onClick={this.toggleIsInputMode.bind(this,false)}/>   
        </div>
    </Form></div>);
	}

	render() {

		const {
			title,
			isDragging,
			connectDragSource,
			connectDropTarget,
		} = this.props

		const opacity = isDragging ? 0.5 : 1

		return connectDragSource(
			connectDropTarget(
				<div style={{ ...style, opacity }} className={this.props.className}>
				{title}
				{this.props.cards}
				{this.state.isInputMode === false 	
				? 
					<div>
							<p style={{textAlign: 'right'}}><a href="javascript:void(0);" onClick={this.toggleIsInputMode.bind(this,true,this.props.keys)}>Add Card</a></p>
					</div>
						: this.state.currentLane===this.props.selectedLaneId 
						?
					this.formList(this.props.keys) 
						:
					this.toggleIsInputMode.bind(this,false) &&	<div> <p style={{textAlign: 'right'}}><a href="javascript:void(0);" onClick={this.toggleIsInputMode.bind(this,true,this.props.keys)}>Add Card</a></p></div>
        }
				</div>
			),
		);
	}
}
// Validation of Inputs 
const validate = (values, props) => {
	const errors = {};
	if (!values.cardTitle) {
		errors.cardTitle = "Card Title is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	return errors;
};


export default reduxForm({ form: 'createCardForm', enableReinitialize: true, validate })(connect(state => ({
	state,
	fetchLanes: state.Auth.fetchLanes,
	selectedLaneId: state.Auth.selectedLaneId
}), {
	setSelectedLaneIdAction,
	addCardAction
})(List));
