import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  

const firebaseConfig = {
  apiKey: "AIzaSyD61AWPzhMgCZ_DwqjUl1YoKjyx681nFgc",
  authDomain: "task-management-63843.firebaseapp.com",
  projectId: "task-management-63843",
  storageBucket: "task-management-63843.firebasestorage.app",
  messagingSenderId: "185537438966",
  appId: "1:185537438966:web:4050652bb08e3b8a4538d7",
  measurementId: "G-6MJGMD10XY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);  

export { auth, provider, db }; 
