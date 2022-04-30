import firebase from "firebase";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD84-kT6qbvseIx5Ej1Kw4G6sNLmd49oWM",
  authDomain: "taller-3-react.firebaseapp.com",
  projectId: "taller-3-react",
  storageBucket: "taller-3-react.appspot.com",
  messagingSenderId: "272159943228",
  appId: "1:272159943228:web:9a747be02dc742a329f139"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase}