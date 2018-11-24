import * as firebase from "firebase";

const config = {
	apiKey: "AIzaSyDz1Mtm18fm2Z38x5c9sFDJ_6_FZDFY9Qs",
	authDomain: "secret-santa-1.firebaseapp.com",
	databaseURL: "https://secret-santa-1.firebaseio.com",
	projectId: "secret-santa-1",
	storageBucket: "secret-santa-1.appspot.com",
	messagingSenderId: "452216153393"
};
firebase.initializeApp(config)

export default firebase;