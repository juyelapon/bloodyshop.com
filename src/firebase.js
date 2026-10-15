
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3_qxpkuXan6ZFqYCZcgO8eZFjihXdwVU",
  authDomain: "shophub-ddc66.firebaseapp.com",
  projectId: "shophub-ddc66",
  storageBucket: "shophub-ddc66.firebasestorage.app",
  messagingSenderId: "1089376392812",
  appId: "1:1089376392812:web:b4aebbb9381fd5be2faa49",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
