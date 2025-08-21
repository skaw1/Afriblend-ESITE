import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Hardcoded Firebase configuration for development
const firebaseConfig = {
  apiKey: "AIzaSyC_5WsTU2q44AsQ0ygcSIhQCjGRU_Q7g_M",
  authDomain: "ecommerce-kb001.firebaseapp.com",
  projectId: "ecommerce-kb001",
  storageBucket: "ecommerce-kb001.appspot.com",
  messagingSenderId: "588353102866",
  appId: "1:588353102866:web:31ef28760f1eea35fc24cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll use in your app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);