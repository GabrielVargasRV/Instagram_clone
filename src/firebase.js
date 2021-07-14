import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  //YOUR FIREBASE CONFIG HERE
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const googleProvider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();
  export const db = firebase.firestore();