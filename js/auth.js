import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const username =
document.getElementById(
"username"
);

const email =
document.getElementById(
"email"
);

const password =
document.getElementById(
"password"
);

const registerBtn =
document.getElementById(
"registerBtn"
);

const loginBtn =
document.getElementById(
"loginBtn"
);

/* REGISTER */

if(registerBtn){

registerBtn.addEventListener(
"click",
async()=>{

const userName =
username.value.trim();

const userEmail =
email.value.trim();

const userPassword =
password.value.trim();

if(
userName==="" ||
userEmail==="" ||
userPassword===""

){

alert(
"Fill all fields"
);

return;

}

try{

const userCredential =
await createUserWithEmailAndPassword(
auth,
userEmail,
userPassword
);

await addDoc(
collection(
db,
"users"
),
{

uid:
userCredential.user.uid,

username:
userName,

bio:
"",

email:
userEmail

}
);

alert(
"Registration Successful"
);

window.location.href =
"index.html";

}
catch(error){

console.log(
error
);

alert(
error.message
);

}

});
}

/* LOGIN */

if(loginBtn){

loginBtn.addEventListener(
"click",
async()=>{

const userEmail =
email.value.trim();

const userPassword =
password.value.trim();

try{

await signInWithEmailAndPassword(
auth,
userEmail,
userPassword
);

alert(
"Login Successful"
);

window.location.href =
"home.html";

}
catch(error){

console.log(
error
);

alert(
error.message
);

}

});
}
