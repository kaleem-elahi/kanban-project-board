import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import App from '../public/components/app';
import Login from '../public/components/login';
import Register from '../public/components/register';
import Dashboard from '../public/components/dashboard';
import ViewProject from '../public/components/ViewProject';
class Routes extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/viewproject/:projectId" component={ViewProject} />
            </Switch>
		);
	}
}
export default Routes;
