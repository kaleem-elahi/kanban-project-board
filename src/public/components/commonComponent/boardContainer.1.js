import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SubContainer from './subContainer';

class BoardContainer extends Component {

	render() {

		let senddata = this.props.sendData.lanes || [];
		console.log(Object.keys(senddata), "sendData::sendData");

		const renderLanes = () => Object.keys(senddata)
			.map((key, i) => {
				console.log(key);
				console.log(senddata[key].cards);
				console.log("FFFF");
				const cards = senddata[key].cards.map((card) => {
					if (senddata[key].id == card.listId) {
						return (
							<div className="card">
              <div className="card-title">{card.title}</div>
              <hr/>
              <div className="card-description">{card.description}</div>
              </div>
						);
					}
				})
				return (<div className="col-sm-2 lane">
        <strong>{ senddata[key].title}</strong>
        {cards}
        </div>);
			});

		console.log(senddata);
		console.log(renderLanes);

		return (
			<div className="row  ListFormStyle height-100">                
        <div className="col-sm-12">
          {renderLanes()}
					<SubContainer/>
          <div className="col-sm-2 lane">
            <strong></strong>
            <div className="lane-new">
            {this.props.NewForm}
            </div>
          </div>
         


        </div>
      </div>
		);
	}

}

export default BoardContainer;
