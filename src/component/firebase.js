import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

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
const imgDB = getStorage(app)
const txtDB = getFirestore(app)
const db = getFirestore(app);




export{app,auth,analytics,imgDB,txtDB,db};