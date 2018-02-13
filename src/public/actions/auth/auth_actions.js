import _ from 'lodash';
import { database, auth, Googleprovider, Facebookprovider, Twitterprovider, storage } from '../../../config/firebase_config';
import { success, error } from 'react-notification-system-redux';
import ActionTypes from './auth_action_types.js';
import firebase from 'firebase';


const notificationOpts = {
	title: 'Sample Notification',
	message: '',
	position: 'tr',
	autoDismiss: 3
};

// Array To Objects
const arrayToObj = (array) => array.reduce((obj, item) => {
	obj[item.key] = item;
	return obj;
}, {});

/**
 * Fetch Projects Actions
 **/

let setSelectedLaneIdFulfilledAction = (payload) => {
	return { type: ActionTypes.setSelectedlaneId, payload };
};

export const setSelectedLaneIdAction = (id) => {
	return dispatch => {
		dispatch(setSelectedLaneIdFulfilledAction(id));
	};
};




const fetchUserRolesInternal = (uid) => {
	return new Promise((resolve, reject) => {
		database.ref('/roles/' + uid)
			.once("value", snapshot => {
				resolve(snapshot.val());
			})
			.catch((error) => {
				reject(error);
			});
	});
};

const setUserLastLoggedInTime = (uid) => {
	if (uid) {
		database.ref('/roles/' + uid)
			.update({
				lastLoggedInOn: firebase.database.ServerValue.TIMESTAMP
			});
	}
};


/**
 * Selected project name based on click of authorized user
 * @param {*} projectname
 * @param {*} projectid
 */
let selectedProjectAction = (payload) => {
	return { type: ActionTypes.setSelectedProject, payload };
};

export const selectedProjectActionF = (params) => {
	// console.log(params, "params...params....params....params....params....params");
	return dispatch => {
		// database.ref('projects')
		// .push({ ...params });
		// database.ref('projects').child({projectName}).update({projectDescription});
		// user.updateProfile({displayName: username});
		dispatch(selectedProjectAction(params));
	};
};


/**
 * Fetch Users Actions
 **/
let fetchUsersRequestedAction = () => {
	return { type: ActionTypes.fetchUsersRequested };
};

let fetchUsersRejectedAction = () => {
	return { type: ActionTypes.fetchUsersRejected };
};

let fetchUsersFulfilledAction = (payload) => {
	return { type: ActionTypes.fetchUsersFulfilled, payload };
};

export const fetchUsers = (params) => {
	return dispatch => {
		dispatch(fetchUsersRequestedAction());
		let promise;
		if (params) {
			promise = database.ref('/users/' + params);
		} else {
			promise = database.ref('users');
		}
		promise.on('value', snapshot => {
			dispatch(fetchUsersFulfilledAction(snapshot.val()));
		})
		return promise;
	};
};


/**
 * Fetch Projects Actions
 **/
let fetchProjectsRequestedAction = () => {
	return { type: ActionTypes.fetchProjectsRequested };
};

let fetchProjectsRejectedAction = () => {
	return { type: ActionTypes.fetchProjectsRejected };
};

let fetchProjectsFulfilledAction = (payload) => {
	return { type: ActionTypes.fetchProjectsFulfilled, payload };
};

/*
export function saveProduct(params) {
	const productsRef = database.ref(‘products’);
	const productQuantityHistory = params.product_quantity_history;
	const key = params.key || productsRef.push()
		.key;
	delete params.key;
	delete params.product_quantity_history;
	return dispatch => {
		dispatch(saveProductRequestedAction());
		const promise = database
			.ref(‘/products/’ + key)
			.set(params);
		promise.then(() => {
				if (_.isObject(productQuantityHistory)) {
					productQuantityHistory.createdAt = timestamp;
				}
				database.ref(‘/products/’ + key + ‘/product_quantity_histroy’).push(productQuantityHistory);
					dispatch(saveProductFulfilledAction(key));
				})
			.catch((err) => {
				dispatch(saveProductRejectedAction(key));
				dispatch(error({
					...notificationOpts,
					title: “Error”,
					message: `Problem while saving product ${params.name}. ${err.message}`
				}));
			});
			return promise;
		}
	}
*/


export const fetchProjects = (authUserId) => {
	return dispatch => {
		dispatch(fetchProjectsRequestedAction());
		let promise;
		if (authUserId) {
			// console.log("I'm in fetchProjects");
			// console.log(params);
			promise = database.ref('projects/' + authUserId);
			// selectedProjectActionF()
			promise.on('value', snapshot => {
				dispatch(fetchProjectsFulfilledAction(snapshot.val()));
			})
		} else {
			console.log("authUserId : didn't found!");
		}

		return promise;
	};
};


/**
 * Login actions
 */

const loginRequestedAction = () => {
	return { type: ActionTypes.loginRequested };
}
const loginRejectedAction = (error) => {
	return { type: ActionTypes.loginRejected, payload: error };
}
const loginFulfilledAction = (user) => {
	return { type: ActionTypes.loginFulfilled, payload: user };
}

/**
 * Log in user based on provided user/pass
 * @param {*} user
 * @param {*} pass
 */
export const login = (user, pass) => {
	return dispatch => {
		dispatch(loginRequestedAction());
		const promise = auth()
			.signInWithEmailAndPassword(user, pass);
		promise.then((user) => {
				const uid = user.uid || user.user.uid;
				setUserLastLoggedInTime(uid);
				dispatch(loginFulfilledAction(user));
			})
			.catch((error) => {
				dispatch(loginRejectedAction(error));
			});
		return promise;
	};
};



/**
 * Fetch List actions
 */

const fetchLanesRequestedAction = () => {
	return { type: ActionTypes.fetchLanesRequested };
}
const fetchLanesRejectedAction = (error) => {
	return { type: ActionTypes.fetchLanesRejected, payload: error };
}
const fetchLanesFulfilledAction = (data) => {
	return { type: ActionTypes.fetchLanesFulfilled, payload: data };
}

/**
 * Add List based on Project Name provided by user
 * @param {*} 
 * @param {*} 
 */

export const snapshotToArray = snapshot => {
	let returnArr = [];
	snapshot.forEach(childSnapshot => {
		let item = childSnapshot.val();
		item.key = childSnapshot.key;
		returnArr.push(item);
	});
	return returnArr;
};

export const fetchLanesAction = (params) => {
	return dispatch => {
		dispatch(fetchLanesRequestedAction());
		let promise;
		promise = database.ref('/projects')
			.child(params);
		promise.on('value', snapshot => {
			let data = snapshot.val();
			let newArray;
			// console.clear();
			if (!_.isEmpty(data.lanes)) {
				newArray = _.map(data.lanes, (lane, index) => {
					return {
						...lane,
						key: index
					}
				})
			}
			dispatch(fetchLanesFulfilledAction(newArray));
		})
		return promise;
	};
};


/**
 * Add Card actions
 */

const addCardRequestedAction = () => {
	return { type: ActionTypes.addCardRequested };
}
const addCardRejectedAction = (error) => {
	return { type: ActionTypes.addCardRejected, payload: error };
}
const addCardFulfilledAction = (data) => {
	return { type: ActionTypes.addCardFulfilled, payload: data };
}
/**
 * Add List based on Project Name provided by user
 * @param {*} title
 */
export const addCardAction = (projKey, laneKeyId, cardData) => {
	const { cardTitle, description } = cardData;
	let createCard = {
		"title": cardTitle,
		"description": description
	};

	return dispatch => {
		dispatch(addCardRequestedAction());
		database.ref('projects/' + projKey)
			.child('lanes/' + laneKeyId)
			.child('cards')
			.push(createCard);
		dispatch(addCardRejectedAction(error));
	};
};




/**
 * Add List actions
 */

const addListRequestedAction = () => {
	return { type: ActionTypes.addListRequested };
}
const addListRejectedAction = (error) => {
	return { type: ActionTypes.addListRejected, payload: error };
}
const addListFulfilledAction = (user) => {
	return { type: ActionTypes.addListFulfilled, payload: user };
}
/**
 * Add List based on Project Name provided by user
 * @param {*} title
 */
export const setAddList = (keyId, title, fetchLanes) => {
	let createlane = {
		"title": title,
		"pos": fetchLanes.length + 1,
	};
	return dispatch => {
		dispatch(addListRequestedAction());
		database.ref('projects/' + keyId)
			.child('lanes')
			.push(createlane);

		dispatch(addListFulfilledAction(title));
		fetchLanesAction(keyId)
		dispatch(addListRejectedAction(error));
	};
};


/**
 * 	SAVE FETCHED LANES ACTION
 */

const saveFetchedLanesRequestedAction = () => {
	return { type: ActionTypes.saveFetchedLanesRequested };
}
const saveFetchedLanesRejectedAction = (error) => {
	return { type: ActionTypes.saveFetchedLanesRejected, payload: error };
}
const saveFetchedLanesFulfilledAction = (user) => {
	return { type: ActionTypes.saveFetchedLanesFulfilled, payload: user };
}
/**
 * Add List based on Project Name provided by user
 * @param {*} title
 */
export const saveFetchedLanesAction = (keyId, params) => {
	return dispatch => {
		dispatch(saveFetchedLanesRequestedAction());
		database.ref('projects/' + keyId)
			.child('lanes')
			.set(params);
		dispatch(saveFetchedLanesFulfilledAction(params));
		dispatch(saveFetchedLanesRejectedAction(error));
	};
};



/**
 * Register actions
 */

const registerRequestedAction = () => {
	return { type: ActionTypes.registerRequested };
}
const registerRejectedAction = (error) => {
	return { type: ActionTypes.registerRejected, payload: error };
}
const registerFulfilledAction = (user) => {
	return { type: ActionTypes.registerFulfilled, payload: user };
}
const sendEmailVerification = (user) => {
	return { type: ActionTypes.sendEmailVerification, payload: user };
}
/**
 * Register user based on provided user/pass
 * @param {*} user
 * @param {*} pass
 */
export const register = (params) => {
	const { email, password, username } = params;
	delete params.confirm_password;
	delete params.password;
	return dispatch => {
		dispatch(registerRequestedAction());
		const promise = auth()
			.createUserWithEmailAndPassword(email, password);
		promise.then((user) => {
				database.ref('users')
					.child(user.uid)
					.child('profile')
					.update({ ...params });
				user.updateProfile({ displayName: username });
				dispatch(registerFulfilledAction(user));
			})
			.catch((error) => {
				dispatch(registerRejectedAction(error));
			});
		return promise;
	};
};


/**
 * addProject actions
 */

const addProjectRequestedAction = () => {
	return { type: ActionTypes.addProjectRequested };
}
const addProjectRejectedAction = (error) => {
	return { type: ActionTypes.addProjectRejected, payload: error };
}
const addProjectFulfilledAction = (projectName) => {
	return { type: ActionTypes.addProjectFulfilled, payload: projectName };
}

/**
 * Add project based on provided user/pass
 * @param {*} 
 * @param {*} 
 */
export const addProjectName = (uid, params) => {
	const projectsRef = database.ref('projects');
	const key = uid || projectsRef.push()
		.key;

	return dispatch => {
		dispatch(addProjectRequestedAction());
		database.ref('projects/' + key)
			.push({ ...params });
		// .set({ params });
		dispatch(addProjectFulfilledAction(params));
		dispatch(addProjectRejectedAction(error));
	};
};


/**
 * Social Log in user based on provided user/pass
 * @param {*} user
 * @param {*} pass
 */

export const socialLogin = (provider) => {
	return dispatch => {
		dispatch(loginRequestedAction());
		let promise;
		if (provider === 'google') {
			promise = auth()
				.signInWithPopup(Googleprovider);
		} else if (provider === 'facebook') {
			promise = auth()
				.signInWithPopup(Facebookprovider);
		} else if (provider === 'twitter') {
			promise = auth()
				.signInWithPopup(Twitterprovider);
		}
		promise.then((user) => {
				const uid = user.uid || user.user.uid;
				setUserLastLoggedInTime(uid);
				dispatch(loginFulfilledAction(user.user || user));
			})
			.catch((error) => {
				dispatch(loginRejectedAction(error));
			});
		return promise;
	};
};



/**
 * On load of Authentical HOC check for auth status, if already logged in allow access
 */
export const checkAuthStatus = () => {
	return dispatch => {
		dispatch(loginRequestedAction());
		const promise = new Promise(function (resolve, reject) {
			const unsubscribe = auth()
				.onAuthStateChanged((user) => {
					if (user) {
						resolve(user);
						dispatch(loginFulfilledAction(user));
					} else {
						dispatch(loginRejectedAction());
						reject();
					}
					unsubscribe();
				});
		});
		return promise;
	};
}


/**
 * Logout actions
 */

const logoutRequestedAction = () => {
	return { type: ActionTypes.logoutRequested };
}
const logoutRejectedAction = () => {
	return { type: ActionTypes.logoutRejected };
}
const logoutFulfilledAction = () => {
	return { type: ActionTypes.logoutFulfilled };
}

export const logout = () => {
	return dispatch => {
		dispatch(logoutRequestedAction());
		const promise = auth()
			.signOut();
		promise.then((user) => {
				dispatch(logoutFulfilledAction(user));
			})
			.catch((error) => {
				dispatch(logoutRejectedAction());
			});
		return promise;
	};
};


/**
 * Save Profile Image Actions
 **/

const saveProfileImageRequestedAction = () => {
	return { type: ActionTypes.saveProfileImageRequested };
}

const saveProfileImageRejectedAction = () => {
	return { type: ActionTypes.saveProfileImageRejected }
}

const saveProfileImageProgressAction = (payload) => {
	return { type: ActionTypes.saveProfileImageProgress, payload };
}

const saveProfileImageFulfilledAction = (payload) => {
	return { type: ActionTypes.saveProfileImageFulfilled, payload };
}

export const saveProfileImage = (params) => {
	const key = params.id;
	const name = params.name;
	const imageRef = storage.ref('images/' + key + '/' + name);
	return dispatch => {
		dispatch(saveProfileImageRequestedAction());
		const imageUploadPromise = imageRef.put(params.file);
		imageUploadPromise.on('state_changed', (snapshot) => {
			dispatch(saveProfileImageProgressAction(snapshot));
		});
		imageUploadPromise.then((snapshot) => {
				const currentUser = auth()
					.currentUser;
				currentUser.updateProfile({ photoURL: snapshot.downloadURL });
				database.ref('users')
					.child(currentUser.uid)
					.child('photoURL')
					.set(snapshot.downloadURL);
				dispatch(saveProfileImageFulfilledAction(key));
			})
			.catch((err) => {
				dispatch(saveProfileImageRejectedAction(key));
			});
		return imageUploadPromise;
	}
};

/**
 * Delete profile Image Actions
 **/
function deleteProfileImageRequestedAction() {
	return { type: ActionTypes.deleteProfileImageRequested };
}

function deleteProfileImageRejectedAction() {
	return { type: ActionTypes.deleteProfileImageRejected }
}

function deleteProfileImageFulfilledAction(payload) {
	return { type: ActionTypes.deleteProfileImageFulfilled, payload };
}

export function deleteProfileImage(params) {
	const currentUser = auth()
		.currentUser;
	const key = currentUser.uid;
	const imageRef = storage.ref('images/' + key);
	const usersRef = database.ref('/users/' + key + '/photoURL');
	return dispatch => {
		dispatch(deleteProfileImageRequestedAction());
		var promise = new Promise(function (resolve, reject) {
			const deleteImage = usersRef.set('');
			deleteImage.then((user) => {
				currentUser.updateProfile({ photoURL: "" });
			});
		});
	}
}

/**
 * Show growl notification
 *
 * @returns
 */
export const showNotification = (title, message, fail) => {
	return dispatch => {
		if (fail) {
			dispatch(error({
				...notificationOpts,
				title: title || "Success",
				message
			}));
		} else {
			dispatch(success({
				...notificationOpts,
				title: title || "Success",
				message
			}));
		}
	}
}
