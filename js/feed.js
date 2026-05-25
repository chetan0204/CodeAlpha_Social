import { auth, db } from "./firebase.js";

import {
signOut
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp,
query,
where
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const logoutBtn =
document.getElementById(
"logoutBtn"
);

const postBtn =
document.getElementById(
"postBtn"
);

const postText =
document.getElementById(
"postText"
);

const postsContainer =
document.getElementById(
"postsContainer"
);

const toast =
document.getElementById(
"toast"
);

/* TOAST */

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

/* LOGOUT */

logoutBtn.addEventListener(
"click",
async()=>{

await signOut(auth);

showToast(
"Logged Out"
);

setTimeout(()=>{

window.location.href =
"index.html";

},800);

});

/* CREATE POST */

postBtn.addEventListener(
"click",
async()=>{

const user =
auth.currentUser;

if(!user){

showToast(
"Login First"
);

return;

}

if(
postText.value.trim()===""
){

showToast(
"Write something"
);

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
user.uid
)
);

const userSnap =
await getDocs(
userQuery
);

const userData =
userSnap.docs[0]
.data();

const currentUsername =
userData.username
||
user.email;

await addDoc(
collection(
db,
"posts"
),
{

userId:
user.uid,

username:
currentUsername,

email:
user.email,

text:
postText.value,

createdAt:
serverTimestamp()

}
);

showToast(
"Post Published"
);

postText.value="";

loadPosts();

});

/* LOAD POSTS */

async function loadPosts(){

postsContainer.innerHTML =
"";

const snapshot =
await getDocs(
collection(
db,
"posts"
)
);

if(snapshot.empty){

postsContainer.innerHTML =

`
<div class="empty-feed">

<h3>No posts yet</h3>

<p>
Start the conversation ✨
</p>

</div>
`;

return;

}

snapshot.forEach(
(docSnap)=>{

const post =
docSnap.data();

const postId =
docSnap.id;

const displayName =
post.username
||
post.email
||
"User";

const avatar =
displayName
.charAt(0)
.toUpperCase();

postsContainer.innerHTML +=

`
<div class="post-card">

<div class="post-header">

<div class="avatar">

${avatar}

</div>

<div>

<b>

@${displayName}

</b>

</div>

</div>

<p>

${post.text}

</p>

<div class="post-actions">

<button
onclick="toggleLike('${postId}')">

❤️ Like

</button>

<button
onclick="toggleCommentBox('${postId}')">

💬 Comment

</button>

${
auth.currentUser &&
auth.currentUser.uid===post.userId
?
`
<button
onclick="deletePost('${postId}')">

🗑 Delete

</button>
`
:
""
}

</div>

<div
id="commentBox-${postId}"
style="display:none; margin-top:15px;">

<input
type="text"
id="comment-${postId}"
placeholder="Write comment">

<button
onclick="addComment('${postId}')">

Send

</button>

</div>

<div
id="comments-${postId}">
</div>

</div>
`;

loadComments(
postId
);

});

}

loadPosts();

/* COMMENT */

window.toggleCommentBox =
function(postId){

const box =
document.getElementById(
`commentBox-${postId}`
);

box.style.display =
box.style.display==="none"
?
"block"
:
"none";

}

window.addComment =
async function(postId){

const user =
auth.currentUser;

const commentInput =
document.getElementById(
`comment-${postId}`
);

const text =
commentInput.value;

if(
text.trim()===""
)
return;

await addDoc(
collection(
db,
"comments"
),
{

postId,
userId:
user.uid,
text,
createdAt:
serverTimestamp()

}
);

commentInput.value="";

showToast(
"Comment Added"
);

loadComments(
postId
);

}

/* LOAD COMMENTS */

async function loadComments(postId){

const commentsDiv =
document.getElementById(
`comments-${postId}`
);

commentsDiv.innerHTML =
"";

const q =
query(
collection(
db,
"comments"
),
where(
"postId",
"==",
postId
)
);

const snapshot =
await getDocs(q);

snapshot.forEach(
(docSnap)=>{

const comment =
docSnap.data();

commentsDiv.innerHTML +=

`
<div class="comment-bubble">

💬 ${comment.text}

</div>
`;

});

}

/* LIKE */

window.toggleLike =
async function(postId){

showToast(
"Liked ❤️"
);

}

/* DELETE */

window.deletePost =
async function(postId){

const confirmDelete =
confirm(
"Delete post?"
);

if(!confirmDelete)
return;

const commentsQuery =
query(
collection(
db,
"comments"
),
where(
"postId",
"==",
postId
)
);

const commentsSnap =
await getDocs(
commentsQuery
);

for(
const c of commentsSnap.docs
){

await deleteDoc(
c.ref
);

}

await deleteDoc(
doc(
db,
"posts",
postId
)
);

showToast(
"Post Deleted"
);

loadPosts();

}
