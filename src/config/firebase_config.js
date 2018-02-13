import firebase from 'firebase';
// Initialize Firebase
var config = {
	apiKey: "AIzaSyAiGGdUEFwZW9NohsRKM9fPLX0vUM5vmM8",
	authDomain: "user-subscription.firebaseapp.com",
	databaseURL: "https://user-subscription.firebaseio.com",
	projectId: "user-subscription",
	storageBucket: "user-subscription.appspot.com",
	messagingSenderId: "870788421161"
};
firebase.initializeApp(config);

export const Googleprovider = new firebase
	.auth
	.GoogleAuthProvider();
export const Facebookprovider = new firebase
	.auth
	.FacebookAuthProvider();
export const Twitterprovider = new firebase
	.auth
	.TwitterAuthProvider();
export const auth = firebase.auth;
export const storage = firebase.storage();
export const database = firebase.database();
export const timestamp = firebase.database.ServerValue.TIMESTAMP;
export default { database, firebase };
