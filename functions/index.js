const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/**
 * When a new user is added to the authentication, create its reference to our database with its UID as a key and data as email and role.
 */
exports.createUsers = functions
        .auth
        .user()
        .onCreate((event) => {
            const {uid} = event.data;
            const email = event.data.email || "-";
            const username = event.data.displayName || "-";
            console.log(event.data)
            admin
                .database()
                .ref('/users/' + uid)
                .set({
                    email,
                    username,
                    profile: event.data.providerData
                            ? event.data.providerData[0]
                            : {},
                    createdOn: admin.database.ServerValue.TIMESTAMP,
                    lastLoggedInOn: admin.database.ServerValue.TIMESTAMP
                });
        });

/**
 * When a user is removed from authentication, remvoe its details from database roles.
 */
exports.removeUser = functions
        .auth
        .user()
        .onDelete((event) => {
            const {uid, email} = event.data;
            admin
                    .database()
                    .ref('/users/' + uid)
                    .remove();
        });
