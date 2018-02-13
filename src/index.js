import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import reducers from './reducers';
import devToolsEnhancer from 'remote-redux-devtools';
import Routes from './routes/routes';
import '../node_modules/font-awesome/css/font-awesome.min.css';
// Logger with default options
import logger from 'redux-logger';


const createStoreWithMiddleware = applyMiddleware(reduxThunk, logger)(createStore);
const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
	<Provider store={createStoreWithMiddleware(reducers, devToolsEnhancer())}>
            <Router forceRefresh={!supportsHistory} >
           
                <div>
                    <Routes />
                </div>
               
            </Router>
    </Provider>,
	document.getElementById('root'));
