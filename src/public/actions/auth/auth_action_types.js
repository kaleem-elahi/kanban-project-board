const actionTypes = {
	loginRequested: 'LOGIN_REQUESTED',
	loginRejected: 'LOGIN_REJECTED',
	loginFulfilled: 'LOGIN_FULFILLED',
	registerRequested: 'REGISTER_REQUESTED',
	registerRejected: 'REGISTER_REJECTED',
	registerFulfilled: 'REGISTER_FULFILLED',
	logoutRequested: 'LOGOUT_REQUESTED',
	logoutRejected: 'LOGOUT_REJECTED',
	logoutFulfilled: 'LOGOUT_FULFILLED',
	fetchUsersRequested: 'FETCH_USERS_REQUESTED',
	fetchUsersRejected: 'FETCH_USERS_REJECTED',
	fetchUsersFulfilled: 'FETCH_USERS_FULFILLED',
	sendEmailVerification: 'SEND_EMAIL_VERIFICATION',
	addProjectRequested: 'ADD_PROJECT_REQUESTED',
	addProjectRejected: 'ADD_PROJECT_REJECTED',
	addProjectFulfilled: 'ADD_PROJECT_FULFILLED',
	addListRequested: 'ADD_LIST_REQUESTED',
	addListRejected: 'ADD_LIST_REJECTED',
	addListFulfilled: 'ADD_LIST_FULFILLED',
	fetchProjectsRequested: 'FETCH_PROJECTS_REQUESTED',
	fetchProjectsRejected: 'FETCH_PROJECTS_REJECTED',
	fetchProjectsFulfilled: 'FETCH_PROJECTS_FULFILLED',
	setSelectedProject: 'SELECTED_PROJECT',
	fetchLanesRequested: 'FETCH_LANES_REQUESTED',
	fetchLanesRejected: 'FETCH_LANES_REJECTED',
	fetchLanesFulfilled: 'FETCH_LANES_FULFILLED',
	saveFetchedLanesRequested: 'SAVE_FETCHEDLANES_REQUESTED',
	saveFetchedLanesRejected: 'SAVE_FETCHEDLANES_REJECTED',
	saveFetchedLanesFulfilled: 'SAVE_FETCHEDLANES_FULFILLED',
	setSelectedlaneId: 'SET_SELECTED_LANE_ID',
	addCardRejected: 'ADD_CARD_REJECTED',
	addCardFulfilled: 'ADD_CARD_FULFILLED',
	addCardRequested: 'ADD_CARD_REQUESTED',


	/*Save Profile Image */
	saveProfileImageRequested: 'SAVE_PROFILE_IMAGE_REQUESTED',
	saveProfileImageRejected: 'SAVE_PROFILE_IMAGE_REJECTED',
	saveProfileImageProgress: 'SAVE_PROFILE_IMAGE_PROGRESS',
	saveProfileImageFulfilled: 'SAVE_PROFILE_IMAGE_FULFILLED',

	/*Save Profile Image */
	saveUserProfileImageRequested: 'SAVE_USER_PROFILE_IMAGE_REQUESTED',
	saveUserProfileImageRejected: 'SAVE_USER_PROFILE_IMAGE_REJECTED',
	saveUserProfileImageFulfilled: 'SAVE_USER_PROFILE_IMAGE_FULFILLED',

	/*Delete Profile Image */
	deleteProfileImageRequested: 'DELETE_PROFILE_IMAGE_REQUESTED',
	deleteProfileImageRejected: 'DELETE_PROFILE_IMAGE_REJECTED',
	deleteProfileImageFulfilled: 'DELETE_PROFILE_IMAGE_FULFILLED',

};
export default actionTypes;
