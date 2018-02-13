import { combineReducers } from 'redux';
import publicReducers from './public/reducers';
const rootReducer = combineReducers({
    ...publicReducers
});
export default rootReducer;
