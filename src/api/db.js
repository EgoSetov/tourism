import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyANylwh1D3EWssMGTCQtLdHBlN6p7Dsf-A",
	authDomain: "tourism-67457.firebaseapp.com",
	projectId: "tourism-67457",
	storageBucket: "tourism-67457.appspot.com",
	messagingSenderId: "221032035153",
	appId: "1:221032035153:web:8bba911f2a021ded319970"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore()

export const City = db.collection('Citys')
export const Application = db.collection('Applications')
export const Review = db.collection('Reviews')