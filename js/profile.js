import { auth, db }
from "./firebase.js";

import {
collection,
getDocs,
query,
where,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const userEmail =
document.getElementById(
"userEmail"
);

const followersCount =
document.getElementById(
"followersCount"
);

const followingCount =
document.getElementById(
"followingCount"
);

const profileAvatar =
document.getElementById(
"profileAvatar"
);

const bioText =
document.getElementById(
"bioText"
);

const usernameInput =
document.getElementById(
"usernameInput"
);

const bioInput =
document.getElementById(
"bioInput"
);

const saveProfileBtn =
document.getElementById(
"saveProfileBtn"
);

const editBtn =
document.getElementById(
"editBtn"
);

const editSection =
document.getElementById(
"editSection"
);

const toast =
document.getElementById(
"toast"
);

function showToast(msg){

toast.innerHTML =
msg;

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2500);

}

let currentDocRef =
null;

auth.onAuthStateChanged(
async(currentUser)=>{

if(!currentUser){

window.location.href =
"login.html";

return;

}

const userQuery =
query(
collection(
db,
"users"
),
where(
"uid",
"==",
currentUser.uid
)
);

const userSnap =
await getDocs(
userQuery
);

const docSnap =
userSnap.docs[0];

currentDocRef =
docSnap.ref;

const userData =
docSnap.data();

const displayName =
userData.username
||
userData.email
||
"User";

userEmail.innerHTML =
"@"+displayName;

profileAvatar.innerHTML =
displayName
.charAt(0)
.toUpperCase();

bioText.innerHTML =
userData.bio
||
"No bio yet";

usernameInput.value =
userData.username
||
"";

bioInput.value =
userData.bio
||
"";

/* COUNTS */

followersCount.innerHTML =
(
await getDocs(
query(
collection(
db,
"followers"
),
where(
"followingId",
"==",
currentUser.uid
)
)
)
).size;

followingCount.innerHTML =
(
await getDocs(
query(
collection(
db,
"followers"
),
where(
"followerId",
"==",
currentUser.uid
)
)
)
).size;

});

/* EDIT */

editBtn.onclick =
()=>{

editSection.style.display =
editSection.style.display==="block"
?
"none"
:
"block";

}

/* SAVE */

saveProfileBtn.onclick =
async()=>{

if(!currentDocRef)
return;

await updateDoc(
currentDocRef,
{

username:
usernameInput.value.trim(),

bio:
bioInput.value.trim()

}
);

showToast(
"Updated"
);

setTimeout(()=>{

location.reload();

},800);

}