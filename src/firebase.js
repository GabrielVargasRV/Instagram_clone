import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMlYzrlOxVjkPsHvY9wt0CavWYPukVU2g",
  authDomain: "ig-clone-34886.firebaseapp.com",
  projectId: "ig-clone-34886",
  storageBucket: "ig-clone-34886.appspot.com",
  messagingSenderId: "419263874051",
  appId: "1:419263874051:web:8144d72024ef350656ba36"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const db = firebase.firestore();