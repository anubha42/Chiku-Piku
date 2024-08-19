// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeyVUxI4nqs-AbBYh0UZ8QpMpDH9a30zY",
  authDomain: "test-project-2-acfee.firebaseapp.com",
  projectId: "test-project-2-acfee",
  storageBucket: "test-project-2-acfee.appspot.com",
  messagingSenderId: "13808788687",
  appId: "1:13808788687:web:0140083fbef2cd04a003ba",
  measurementId: "G-L4SNNJWHX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);