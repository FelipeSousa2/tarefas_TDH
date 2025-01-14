import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWiwxrE9rjtCSK5Uff9xypgb61ZBCAyss", // Substitua pelos valores corretos da sua conta
  authDomain: "projeto-tdh.firebaseapp.com",
  projectId: "projeto-tdh",
  storageBucket: "projeto-tdh.firebasestorage.app",
  messagingSenderId: "832144513578",
  appId: "1:832144513578:web:02ec5cd8f84a93041c0153",
  measurementId: "G-4260XCWNEL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa o Firebase Auth
const db = getFirestore(app); // Inicializa o Firestore

export { auth, db };
