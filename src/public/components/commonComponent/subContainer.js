import React, { Component } from 'react'
import update from 'immutability-helper'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'
import { database, auth, Googleprovider, Facebookprovider, Twitterprovider, storage } from '../../../config/firebase_config';

const style = {
	width: 400,
}

@DragDropContext(HTML5Backend)
export default class SubContainer extends Component {
	constructor(props) {
		super(props)
		this.moveCard = this.moveCard.bind(this)

		const sampleData = {
			"cards": [{
					"id": "Card1",
					"title": "Write Blog",
					"description": "Can AI make memes",
					"label": "30 mins",
					"listId": "lane1"
				},
				{
					"id": "Card2",
					"title": "Pay Rent",
					"description": "Transfer via NEFT",
					"label": "5 mins",
					"listId": "lane1"
				}
			]
		};


		this.state = {
			cards: [{
					id: 1,
					title: 'Write a cool JS library',
					listId: "lane1"
				},
				{
					id: 2,
					title: 'Make it generic enough',
					listId: "lane1"
				},
				{
					id: 3,
					title: 'Write README',
					listId: "lane1"
				},
				{
					id: 4,
					title: 'Create some examples',
					listId: "lane1"
				},
				{
					id: 5,
					title: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
					listId: "lane1"
				},
				{
					id: 6,
					title: '???',
					listId: "lane1"
				},
				{
					id: 7,
					title: 'PROFIT',
					listId: "lane1"
				},
			],
		}
	}

	moveCard(dragIndex, hoverIndex) {
		console.log(dragIndex, hoverIndex)
		const { cards } = this.state
		const dragCard = cards[dragIndex]


		this.setState(
			update(this.state, {
				cards: {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, dragCard]
					],
				},
			}),
		);

		let newdata = this.state.cards || {};

		database.ref('projects/' + window.location.href.split('/')[5])
			.child('lanes')
			.child('0')
			.child('cards')
			.update(newdata);

	}

	render() {
		const { cards } = this.state

		return (
			<div className="col-sm-2 lane">
				{cards.map((card, i) => (
					<Card
						key={card.id}
						index={i}
						id={card.id}
						text={card.title}
						moveCard={this.moveCard}
					/>
				))}
			</div>
		)
	}
}
