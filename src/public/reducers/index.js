import authReducer from './auth_reducer';
import { reducer as formReducer } from 'redux-form';
import { reducer as notifications } from 'react-notification-system-redux';
// import lists from './lists';

const rootReducer = {
	Auth: authReducer,
	form: formReducer,
	notifications
};
export default rootReducer;
