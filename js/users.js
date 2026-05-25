import { auth, db } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
query,
where
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usersContainer =
document.getElementById(
"usersContainer"
);

const userSearch =
document.getElementById(
"userSearch"
);

const toast =
document.getElementById(
"toast"
);

function showToast(msg){

if(!toast) return;

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

async function loadUsers(){

usersContainer.innerHTML =
"";

const snapshot =
await getDocs(
collection(
db,
"users"
)
);

const currentUser =
auth.currentUser;

const searchTerm =
userSearch
?
userSearch.value
.toLowerCase()
:
"";

snapshot.forEach(
(docSnap)=>{

const user =
docSnap.data();

if(
currentUser &&
user.uid===currentUser.uid
){
return;
}

const username =
user.username
||
"";

const displayName =
username
||
user.email
||
"User";

const bio =
user.bio
||
"No bio yet";

if(
searchTerm &&
!username
.toLowerCase()
.includes(
searchTerm
)
){
return;
}

const avatar =
displayName
.charAt(0)
.toUpperCase();

const followButtonId =
`follow-${user.uid}`;

usersContainer.innerHTML +=

`
<div class="post-card">

<div class="post-header">

<div class="avatar">

${avatar}

</div>

<div>

<b
onclick="openProfile('${user.uid}')"
style="
cursor:pointer;
display:block;
margin-bottom:4px;
">

@${displayName}

</b>

<p class="user-bio">

${bio}

</p>

</div>

</div>

<button
id="${followButtonId}"
onclick="followUser('${user.uid}','${displayName}')">

Follow

</button>

</div>
`;

checkFollow(
user.uid,
followButtonId
);

});

}

auth.onAuthStateChanged(
(user)=>{

if(user){

loadUsers();

}

});

if(userSearch){

userSearch
.addEventListener(
"input",
loadUsers
);

}

window.openProfile =
function(uid){

window.location.href =
`index.html?uid=${uid}`;

}

async function checkFollow(
targetUid,
buttonId
){

const currentUser =
auth.currentUser;

if(!currentUser)
return;

const q =
query(
collection(
db,
"followers"
),
where(
"followerId",
"==",
currentUser.uid
),
where(
"followingId",
"==",
targetUid
)
);

const snapshot =
await getDocs(q);

const btn =
document.getElementById(
buttonId
);

if(
btn &&
!snapshot.empty
){

btn.innerHTML =
"Following ✓";

btn.disabled =
true;

}

}

window.followUser =
async function(
targetUid,
targetName
){

const currentUser =
auth.currentUser;

const q =
query(
collection(
db,
"followers"
),
where(
"followerId",
"==",
currentUser.uid
),
where(
"followingId",
"==",
targetUid
)
);

const snapshot =
await getDocs(q);

if(snapshot.empty){

await addDoc(
collection(
db,
"followers"
),
{

followerId:
currentUser.uid,

followingId:
targetUid,

targetName

}
);

showToast(
"Followed"
);

loadUsers();

}
else{

showToast(
"Already Following"
);

}

}