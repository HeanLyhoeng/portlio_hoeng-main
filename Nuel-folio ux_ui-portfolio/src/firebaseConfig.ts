// Firebase Configuration Template
// Replace the placeholder values with your actual Firebase project credentials
// You can find these in your Firebase Console: Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBugKfAUH354o-iXmzxmbaJmmY2bjSZpyc",
  authDomain: "nuelfoliouxui-portfolio.firebaseapp.com",
  projectId: "nuelfoliouxui-portfolio",
  storageBucket: "nuelfoliouxui-portfolio.firebasestorage.app",
  messagingSenderId: "1040078243298",
  appId: "1:1040078243298:web:737b691f4041537f89e5bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
