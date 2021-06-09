import { db } from "./firebase";

export const getUserData = async (uid) => {
  const snapShot = await db.collection("userData").doc(uid).get();
  const followersSnapShot = await db
    .collection("userData")
    .doc(uid)
    .collection("followers")
    .get();
  const followers = [];
  followersSnapShot.docs.forEach((f) => {
    followers.push(f.id);
  });
  const followingSnapShot = await db
    .collection("userData")
    .doc(uid)
    .collection("following")
    .get();
  const following = [];
  followingSnapShot.docs.forEach((f) => {
    following.push(f.id);
  });
  return {
    ...snapShot.data(),
    followers,
    following,
  };
};

export const getProfile = async (profileUsername, myUserName) => {
  const profileSnapShot = await db
    .collection("userData")
    .where("username", "==", profileUsername)
    .get();
  const followingSnapShot = await db
    .collection("userData")
    .doc(profileSnapShot.docs[0].data().uid)
    .collection("following")
    .get();
  const following = [];
  followingSnapShot.docs.forEach((f) => {
    following.push(f.data());
  });
  const followersSnapShot = await db
    .collection("userData")
    .doc(profileSnapShot.docs[0].data().uid)
    .collection("followers")
    .get();
  const followers = [];
  followersSnapShot.docs.forEach((f) => {
    followers.push(f.data());
  });
  const postsSnapShot = await db
    .collection("posts")
    .where("username", "==", profileUsername)
    .get();
  const posts = [];
  postsSnapShot.docs.forEach((p) => {
    posts.push({id:p.id,...p.data()});
  });
  return {
    posts,
    followers,
    following,
    ...profileSnapShot.docs[0].data(),
  };
};

export const follow = async (username, userData) => {
  const info = await db
    .collection("userData")
    .where("username", "==", username)
    .get();
    console.log(info.docs[0].data())
  await db
    .collection("userData")
    .doc(userData.uid)
    .collection("following")
    .doc(username)
    .set({
      photoURL: info.docs[0].data().photoURL,
      username,
      name: info.docs[0].data().name,
    });
  await db
    .collection("userData")
    .doc(info.docs[0].data().uid)
    .collection("followers")
    .doc(userData.username)
    .set({
      photoURL: userData.photoURL,
      username: userData.username,
      name: userData.name,
    });
  await db
    .collection("userData")
    .doc(userData.uid)
    .collection("following")
    .doc(username)
    .set({
      photoURL: info.docs[0].data().photoURL,
      username,
      name: info.docs[0].data().name,
    });
  const now = Date.now();
  await db
    .collection("userData")
    .doc(info.docs[0].data().uid)
    .collection("activity")
    .add({
      type: "follow",
      username:userData.username,
      messege: ` started following you.`,
      date: now,
    });
};

export const unFollow = async (uid, username, myUid, myUsername) => {
  await db
    .collection("userData")
    .doc(uid)
    .collection("followers")
    .doc(myUsername)
    .delete();

  await db
    .collection("userData")
    .doc(myUid)
    .collection("following")
    .doc(username)
    .delete();
};

export const createChat = async (user, myUser) => {
  const checkIfalreadyExist = await db
    .collection("chats")
    .where("usersname","array-contains",myUser.username)
    .get();
  let id = null;
  checkIfalreadyExist.docs.forEach(c => {
    if(c.data().usersname.includes(user.username)){
      console.log(c.id)
      id = c.id;
    }
  })
  if (id === null) {
    const now = Date.now()
    const obj = {
      usersname: [user.username, myUser.username],
      users: [
        {
          username: user.username,
          photoURL: user.photoURL,
        },
        {
          username: myUser.username,
          photoURL: myUser.photoURL,
        },
      ],
      lastMsg:null,
      lastMsgDate:now
    };
    await db
      .collection("chats")
      .add(obj)
      .then((res) => {
        console.log(res.id);
        id = res.id;
      });
  }

  return id;
};

