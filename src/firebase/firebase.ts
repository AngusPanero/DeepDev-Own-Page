import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9M2ys-zsV6ahjzsCrFyK72vt78ZWru7o",
  authDomain: "deepdev-own-page.firebaseapp.com",
  projectId: "deepdev-own-page",
  storageBucket: "deepdev-own-page.firebasestorage.app",
  messagingSenderId: "923502643597",
  appId: "1:923502643597:web:3ebbc39101c76dafcf55c4",
  measurementId: "G-K7ES4103Q6"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
