// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp7E_KzE9SmHfPEAELBehaMPeg23a3QeY",
  authDomain: "petadoption-32122.firebaseapp.com",
  projectId: "petadoption-32122",
  storageBucket: "petadoption-32122.firebasestorage.app",
  messagingSenderId: "205188380530",
  appId: "1:205188380530:web:72eb95d59b502893a68feb",
  measurementId: "G-XQB37GDGKL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
