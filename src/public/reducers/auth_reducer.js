import ActionTypes from '../actions/auth/auth_action_types';

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.registerRequested:
			{
				return Object.assign({}, state, {
					isLoading: true,
					error: '',
					success: ''
				});
			}

		case ActionTypes.registerRejected:
			{
				return Object.assign({}, state, {
					isLoading: false,
					statusChecked: true,
					error: action.payload
				});
			}
		case ActionTypes.registerFulfilled:
			{
				const newState = {
					isLoading: false,
					success: true,
					statusChecked: true,
					data: action.payload
				};
				return {
					...state,
					...newState
				};
			}

		case ActionTypes.fetchProjectsFulfilled:
			{
				const newState = {
					isLoading: false,
					success: true,
					statusChecked: true,
					projectsData: action.payload
				};
				return {
					...state,
					...newState
				};
			}

		case ActionTypes.setSelectedlaneId:
			{
				const newState = {
					selectedLaneId: action.payload
				};
				return {
					...state,
					...newState
				};
			}

		case ActionTypes.setSelectedProject:
			{
				const newState = {
					selectedProject: action.payload
				};
				return {
					...state,
					...newState
				};
			}

		case ActionTypes.fetchLanesFulfilled:
			{
				const newState = {
					isLoading: false,
					success: true,
					statusChecked: true,
					fetchLanes: action.payload
				};
				return {
					...state,
					...newState
				};
			}

		case ActionTypes.loginRequested:
			{
				return Object.assign({}, state, {
					isLoading: true,
					error: '',
					success: ''
				});
			}
		case ActionTypes.loginRejected:
			{
				return Object.assign({}, state, {
					isLoading: false,
					statusChecked: true,
					emailVerified: false,
					error: action.payload
				});
			}
		case ActionTypes.loginFulfilled:
			{
				let emailVerified = false;
				if (action.payload.emailVerified) {
					emailVerified = true;
				}
				const newState = {
					isLoading: false,
					success: true,
					statusChecked: true,
					emailVerified: emailVerified,
					data: action.payload
				};
				return {
					...state,
					...newState
				};
			}

		case ActionTypes.logoutRequested:
			{
				return Object.assign({}, state, {
					isLoading: true,
					error: '',
					success: ''
				});
			}
		case ActionTypes.logoutRejected:
			{
				return Object.assign({}, state, {
					isLoading: false,
					error: action.payload
				});
			}
		case ActionTypes.logoutFulfilled:
			{
				const newState = {
					isLoading: false,
					success: true,
					data: null //When user logs out, we must set data to null else the old reference will still be there
				};
				return {
					...state,
					...newState
				};
			}
		case ActionTypes.sendEmailVerification:
			{
				const newState = {
					isLoading: true,
					success: true,
					statusChecked: true,
				};
				return {
					...state,
					...newState
				};
			}
		case ActionTypes.fetchUsersRequested:
			{
				return Object.assign({}, state, {
					isLoading: true,
					error: '',
					success: ''
				});
			}
		case ActionTypes.fetchUsersRejected:
			{
				return Object.assign({}, state, {
					isLoading: false,
					error: 'Error while fetching users'
				});
			}
		case ActionTypes.fetchUsersFulfilled:
			{
				const newState = {
					isLoading: false,
					success: true,
					users: action.payload
				};
				return {
					...state,
					...newState
				};
			}

		case ActionTypes.saveUserProfileImageRequested:
			{
				return Object.assign({}, state, {
					isLoading: true,
					error: '',
					success: ''
				});
			}
		case ActionTypes.saveUserProfileImageRejected:
			{
				return Object.assign({}, state, {
					isLoading: false,
					error: 'Error while uploading image'
				});
			}
		case ActionTypes.saveUserProfileImageFulfilled:
			{
				const newState = {
					isLoading: false,
					success: true,
					userId: action.payload
				};
				return {
					...state,
					...newState
				};
			}
		case ActionTypes.deleteProfileImageRequested:
			{
				return Object.assign({}, state, {
					isLoading: true,
					error: '',
					success: ''
				});
			}
		case ActionTypes.deleteProfileImageRejected:
			{
				return Object.assign({}, state, {
					isLoading: false,
					error: '',
					success: ''
				});
			}
		default:
			return state;
	}
};
