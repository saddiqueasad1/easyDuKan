import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB3Sp-yR0k24lyV3kzmFzOue3Az4Ox8SAg",
  authDomain: "east-dukan.firebaseapp.com",
  projectId: "east-dukan",
  storageBucket: "east-dukan.appspot.com",
  messagingSenderId: "777069971997",
  appId: "1:777069971997:web:e360a95c3ad3632ddb94f4",
  measurementId: "G-N7D5G6VHD0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
console.log(auth.name);

const database = getDatabase(app);

export { app, database };
export default firebase;