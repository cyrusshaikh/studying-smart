
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa1BHNQ97kipcOMNFhIDFoAIHN7h_FLS8",
  authDomain: "studying-smart.firebaseapp.com",
  projectId: "studying-smart",
  storageBucket: "studying-smart.firebasestorage.app",
  messagingSenderId: "41426902187",
  appId: "1:41426902187:web:2cf33ad83b2286b8e8abee"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
