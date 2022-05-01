import * as api from "./api";

export interface commentType {
  username: string;
  text: string;
  id: number;
  userPhoto: string;
}

export interface postType {
  username: string;
  userPhoto: string;
  id: string;
  photo: string;
  likes: [string];
  comments: [commentType];
  caption: string;
}

export interface userDataType {
  username: string;
  name: string;
  photoURL: string;
  following: [];
  followers: [];
  uid: string;
}

export interface userType {
  username: string;
  email: string;
  id: string;
  photoURL: string;
  uid: string;
}

export interface stateType {
  user: userType | null;
  userData: userDataType | null;
}

export const getLikes = async (postId: string) => {
  const likes: any = [];
  await api.get("posts", null, { path: postId, collection: "likes" }, (res) => {
    res.docs.forEach((l: any) => likes.push(l.id));
  });
  return likes;
};

export const getComments = async (postId: string) => {
  const comments: any = [];
  await api.get(
    "posts",
    null,
    { path: postId, collection: "comments" },
    (res) => {
      res.docs.forEach((c: any) => comments.push({ id: c.id, ...c.data() }));
    }
  );
  return comments;
};

export const disLike = async (id: string, username: string) => {
  let response;
  await api.del(
    "posts",
    { path: id, collection: "likes", doc: { path: username } },
    (res) => {
      response = res;
    }
  );
  return response;
};

export const addLike = async (id: string, username: string) => {
  let isLiked = null;
  let response;
  await api.get("posts", null, { path: id, collection: "likes" }, (res) => {
    res.forEach((like: any) => {
      if (like.id === username) isLiked = true;
    });
  });
  if (!isLiked) {
    await api.set(
      "posts",
      { path: id, collection: "likes", doc: { path: username } },
      { username: username },
      (res: any) => {
        response = res;
      }
    );
  }
  return response;
};

export const addComment = async (
  id: string,
  commentText: string,
  userData: userDataType
) => {
  const comment = {
    text: commentText,
    username: userData.username,
    userPhoto: userData.photoURL,
  };
  let resId;
  await api.add(
    "posts",
    { path: id, collection: "comments" },
    comment,
    (res) => {
      resId = res.id;
    }
  );
  return {
    ...comment,
    id: resId,
  };
};

export const getLikesAndComments = async (postInfo: any) => {
  const likes: any = await getLikes(postInfo.id);
  const comments: any = await getComments(postInfo.id);
  return {
    ...postInfo,
    likes,
    comments,
  };
};

export const getPosts = async (userData: userDataType) => {
  const postsArr: any = [];
  await api.get(
    "posts",
    { path: "username", opStr: "==", value: "Instagram" },
    null,
    (res) => {
      res.docs.forEach((doc: any) =>
        postsArr.push({ id: doc.id, ...doc.data() })
      );
    }
  );
  if (userData.following.length) {
    await api.get(
      "posts",
      { path: "username", opStr: "in", value: userData.following },
      null,
      (res) => {
        res.docs.forEach((doc: any) =>
          postsArr.push({ id: doc.id, ...doc.data() })
        );
      }
    );
  }
  return postsArr;
};

export const handleLike = (
  post: postType,
  isLiked: boolean,
  username: string,
  setIsLiked: any
) => {
  if (isLiked) {
    setIsLiked(false);
    const tempData: any = post;
    const index = tempData.likes.indexOf(username);
    tempData.likes.splice(index, 1);
    disLike(post.id, username);
    return tempData;
  } else {
    setIsLiked(true);
    const tempData: any = post;
    tempData.likes.push(username);
    addLike(post.id, username);
    return tempData;
  }
};

export const getUserData = async (uid: string) => {
  let userData_snapshot: any;
  const followers: any = [];
  const following: any = [];
  await api.get("userData", null, { path: uid }, (res) => {
    userData_snapshot = res;
  });
  await api.get(
    "userData",
    null,
    { path: uid, collection: "followers" },
    (res) => {
      if (res.docs.length) res.docs.forEach((f: any) => followers.push(f.id));
    }
  );
  await api.get(
    "userData",
    null,
    { path: uid, collection: "following" },
    (res) => {
      if (res.docs.lenght) res.docs.forEach((f: any) => following.push(f.id));
    }
  );
  return {
    ...userData_snapshot.data(),
    followers,
    following,
  };
};

export const getProfile = async (profileUsername: string) => {
  let profile_snapshot: any;
  const following: any = [];
  const followers: any = [];
  const posts: any = [];
  await api.get(
    "userData",
    { path: "username", opStr: "==", value: profileUsername },
    null,
    (res) => {
      profile_snapshot = res.docs[0];
    }
  );
  await api.get(
    "userData",
    null,
    { path: profile_snapshot.data().uid, collection: "following" },
    (res) => {
      if (res.docs) res.docs.forEach((f: any) => following.push(f.data()));
    }
  );
  await api.get(
    "userData",
    null,
    { path: profile_snapshot.data().uid, collection: "followers" },
    (res) => {
      if (res.docs) res.docs.forEach((f: any) => followers.push(f.data()));
    }
  );
  await api.get(
    "posts",
    { path: "username", opStr: "==", value: profileUsername },
    null,
    (res) => {
      if (res.docs)
        res.docs.forEach((p: any) => posts.push({ id: p.id, ...p.data() }));
    }
  );
  return {
    posts,
    followers,
    following,
    ...profile_snapshot.data(),
  };
};

export const follow = async (username: string, userData: userDataType) => {
  let info: any = null;
  await api.get(
    "userData",
    { path: "username", opStr: "==", value: username },
    null,
    (res) => {
      info = res;
    }
  );
  await api.set(
    "userData",
    { path: userData.uid, collection: "following", doc: { path: username } },
    {
      photoURL: info.docs[0].data().photoURL,
      username,
      name: info.docs[0].data().name,
    },
    (res: any) => {}
  );
  await api.set(
    "userData",
    {
      path: info.docs[0].data().uid,
      collection: "followers",
      doc: { path: userData.username },
    },
    {
      photoURL: userData.photoURL,
      username: userData.username,
      name: userData.name,
    },
    (res) => {}
  );
  await api.add(
    "userData",
    { path: info.docs[0].data().uid, collection: "activity" },
    {
      type: "follow",
      username: userData.username,
      message: "started following you",
      data: Date.now(),
    },
    (res) => {}
  );
  return;
};

export const unFollow = async (
  uid: string,
  username: string,
  myUid: string,
  myUsername: string
) => {
  await api.del(
    "userData",
    { path: uid, collection: "followers", doc: { path: myUsername } },
    (res) => {}
  );
  await api.del(
    "userData",
    { path: myUid, collection: "following", doc: { path: username } },
    (res) => {}
  );
  return;
};

export async function createChat(user: any, myUser: any): Promise<any> {
  let id: any = null;
  await api.get(
    "chats",
    { path: "username", opStr: "array-contains", value: myUser.username },
    null,
    (res) => {
      res.docs.forEach((c: any) => {
        if (c.data().usersname.includes(user.username)) {
          id = c.id;
        }
      });
    }
  );
  if (id === null) {
    const now = Date.now();
    const obj: any = {
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
      lastMsg: null,
      lastMsgDate: now,
    };
    await api.add("chats", null, obj, (res: any) => {
      id = res.id;
    });
  }
  return id;
}

let postModalIsopen = false;
export const handlePostModal = () => {
  const postModal = document.getElementById("post-modal");
  console.log(postModal);
  if (postModal) {
    postModalIsopen = !postModalIsopen;
    if (postModalIsopen) postModal.style.display = "block";
    else postModal.style.display = "none";
  }
};
