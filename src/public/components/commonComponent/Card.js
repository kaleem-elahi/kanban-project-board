import React, { Component } from 'react'


const style = {
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'default',
}

export default class Card extends Component {

	constructor(props) {
		super(props)
		this.renderDropdownMenu = this.renderDropdownMenu.bind(this)
	}

	renderDropdownMenu(laneKey) {
		return (
			<ul className="menu">
				<li><a className="moveToDrop-down" href="javascript:void(0);" > </a>
					<ul>
						{
								this.props.lanes.map((lane,i) =>{
									if(lane.key!==laneKey){
										return (<li key={i}><a href="javascript:void(0);" onClick={this.props.handler.bind(null,lane.key,laneKey,this.props.keyId)}>{lane.title}</a></li>)
									}
								})
						}
					</ul>
				</li>
			</ul>
		);
	}


	render() {
		const {
			keyId,
			title,
			description
		} = this.props;

		return (
			<div className="card" style={{ ...style }}>
				<div className="card-title">{title}
				{this.renderDropdownMenu(this.props.laneKey)}
				</div>
				<hr className="hr-thin"/>
				<div className="card-description " title={keyId}>{description}</div>
				 </div>
		)
	}
}
