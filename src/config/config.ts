import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

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

// Initialize Firebase services
const auth = getAuth(app);  // Authentication
const provider = new GoogleAuthProvider(); 
const db = getFirestore(app);  
const storage = getStorage(app);  

export { auth, provider, db, storage };
