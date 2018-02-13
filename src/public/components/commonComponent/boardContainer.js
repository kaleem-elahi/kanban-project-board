import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import { saveFetchedLanesAction, fetchLanesAction } from '../../actions/auth/auth_actions';
import List from './List';


@DragDropContext(HTML5Backend)
class BoardContainer extends Component {

	constructor(props) {
		super(props);
		let fetchlanes = this.props.fetchLanes || [];
		let toSearch = window.location.href.split('/')[5];
		this.props.fetchLanesAction(toSearch);

		this.state = {
			lanesData: fetchlanes || [],
		}

		this.moveLane = this.moveLane.bind(this);
		this.moveCard = this.moveCard.bind(this);
	}

	componentWillMount() {
		const selectedProjectId = localStorage.getItem("selectedProjectId")
		let toSearch = window.location.href.split('/')[5];
		this.props.fetchLanesAction(toSearch || selectedProjectId);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.fetchLanes !== nextProps.fetchLanes) {
			let fetchlanes = nextProps.fetchLanes || [];
			this.setState({ lanesData: fetchlanes || [] })
		}
	}

	// arrayToObj used to Converting array to object json for firebase data pattern.
	arrayToObj = (array) => array.reduce((obj, item, i) => {
		obj[item.key] = item;
		return obj;
	}, {});

	// moveLane Function used to move lane by dragging on another lane.
	moveLane(dragIndex, hoverIndex) {
		console.log(dragIndex, hoverIndex)
		let toSearch = window.location.href.split('/')[5];
		const dragLane = this.state.lanesData[dragIndex];
		this.setState(
			update(this.state, {
				lanesData: {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, dragLane]
					],
				}
			}));
		let resolvedObj = this.arrayToObj(this.state.lanesData);
		this.props.saveFetchedLanesAction(toSearch, resolvedObj);
	}

	// MoveCard is used to move card by dragging on another lane.
	moveCard(destinationLaneKey, currentLaneKey, currentCardKey) {
		/** 
		 * @destinationLaneKey - is Key of Lane (in which the card will be moved to)
		 * @currentLaneKey  - is Key of Current Lane
		 * @currentCardKey - is Key of Current Card 
		 */
		let lanesData = this.state.lanesData || [];
		let removeCardFromLanesData = [];
		let temp = {}; // to store deleted object element
		lanesData.map((lane, n) => {
			Object.keys(lane.cards || [])
				.map((_key) => {
					if (_key === currentCardKey) {
						temp = lane.cards[_key];
						// Will add Object(card) to destinationLane
						const addCardToItsDestinationLane = [...this.state.lanesData.map(lane => {
							return ({
								cards: destinationLaneKey === lane.key && temp !== "" ?
									lane.cards = { ...lane.cards, [currentCardKey]: temp } : lane.cards = { ...lane.cards },
								pos: lane.pos,
								key: lane.key,
								title: lane.title
							})
						})];
						// Will filter out deleted object(card)
						removeCardFromLanesData = [...addCardToItsDestinationLane.map(lane => ({
							cards: (Object.keys(lane.cards || [])
									.map(key => {
										let temp_array = lane.cards[key];
										temp_array['key_id'] = key;
										return temp_array;
									})
									.filter(card => destinationLaneKey === lane.key || card.key_id !== currentCardKey)
								)
								.reduce((obj, card) => {
									obj[card.key_id] = { description: card.description, key_id: card.key_id, title: card.title }
									return obj;
								}, {}),
							pos: lane.pos,
							key: lane.key,
							title: lane.title
						}))];
					}
				})
		});

		// set data to state
		this.setState({ lanesData: removeCardFromLanesData }, () => {
			let resolvedObj = this.arrayToObj(this.state.lanesData);
			let urlProjectKey = window.location.href.split('/')[5];
			this.props.saveFetchedLanesAction(urlProjectKey, resolvedObj);
		});
	}

	render() {
		let lanesStates = this.state.lanesData || [];
		const renderLanes = () => lanesStates
			.map((laneState, i) => {
				const cardsss = laneState.cards || [];
				const cards = Object.keys(cardsss)
					.map((card, i) => {
						return (
							<Card
							key={i}
							index={i}
							handler={this.moveCard}
							laneKey={laneState.key}
							keyId={card}
							id={cardsss[card].id}
							lanes={lanesStates}
							title={cardsss[card].title}
							description = {cardsss[card].description}
						/>
						);
					});
				return (
					<div  key={i}>
					<List 
						className="col-sm-2 lane"
						title={ laneState.title} 
						cards={cards} 
						index={i}
						keys={laneState.key}
						moveLane={this.moveLane}	
					/>
					</div>
				);
			});

		return (
			<div className="row ListFormStyle height-100">                
        <div className="col-sm-12">
          {renderLanes()}
          <div className="col-sm-2 lane">
            <strong>Add Lane</strong>
            <div className="lane-new">
            {this.props.NewForm}
            </div>
          </div>
        </div>
      </div>
		);
	}
}

export default (connect(state => ({
	state,
	fetchLanes: state.Auth.fetchLanes || []
}), {
	fetchLanesAction,
	saveFetchedLanesAction
})(BoardContainer));
