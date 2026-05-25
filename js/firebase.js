// Firebase imports
import { initializeApp }
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth }
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore }
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Paste config below
 const firebaseConfig = {
  apiKey: "AIzaSyCa_UC8eRxX2VE4ZlvwzvZ3ngw9ZUXe5DE",
  authDomain: "code-alpha-socialmedia.firebaseapp.com",
  projectId: "code-alpha-socialmedia",
  storageBucket: "code-alpha-socialmedia.firebasestorage.app",
  messagingSenderId: "914425430914",
  appId: "1:914425430914:web:ee7e49db9c64fd19f9c59b"
};


const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);

export { auth, db };