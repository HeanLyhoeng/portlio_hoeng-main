// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBugKfAUH354o-iXmzxmbaJmmY2bjSZpyc",
  authDomain: "nuelfoliouxui-portfolio.firebaseapp.com",
  projectId: "nuelfoliouxui-portfolio",
  storageBucket: "nuelfoliouxui-portfolio.firebasestorage.app",
  messagingSenderId: "1040078243298",
  appId: "1:1040078243298:web:737b691f4041537f89e5bb",
  measurementId: "G-8GRXB60LHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);