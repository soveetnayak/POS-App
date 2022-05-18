// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtoJDJltklik3bmA7zwF6gKxw_q00W5gw",
  authDomain: "pos-app-1a391.firebaseapp.com",
  projectId: "pos-app-1a391",
  storageBucket: "pos-app-1a391.appspot.com",
  messagingSenderId: "799317907558",
  appId: "1:799317907558:web:fef957922b97916f9435a7",
  measurementId: "G-LGMV52YKZV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
