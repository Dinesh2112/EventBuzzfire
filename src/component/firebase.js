import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCVsLPhmlA7SFESHOo4xNG8uFYElFJacew",
  authDomain: "event-buzzfire.firebaseapp.com",
  projectId: "event-buzzfire",
  storageBucket: "event-buzzfire.appspot.com",
  messagingSenderId: "331809820694",
  appId: "1:331809820694:web:500025064ea51066036537",
  measurementId: "G-GDCEGEK8QT"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();


export{app,auth,analytics};