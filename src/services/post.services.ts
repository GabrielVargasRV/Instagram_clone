import * as api from "../utilities/api";
import { userDataType } from "../types/user.types";
import { postType } from "../types/post.types";
import { db } from "../firebase";

export const getPosts = async (userData: userDataType): Promise<postType[]> => {
    const postsArr: postType[] = [];

    await api.get("posts",{ path: "username", opStr: "==", value: "Instagram" },null,(res) => {
        res.docs.forEach((doc: any) =>postsArr.push({ id: doc.id, ...doc.data() }));
    });

    if (userData.following.length) {
        await api.get("posts",{ path: "username", opStr: "in", value: userData.following },null,(res) => {
            res.docs.forEach((doc: any) => postsArr.push({ id: doc.id, ...doc.data() }));
        });
    }

    return postsArr;
};









export const getPost = async (id: string, userData: userDataType) => {
    const likes:any = [];
    const comments:any = [];
    let isLiked = false;

    const postData = await db.collection("posts").doc(id).get();
    const likesSnapShot = await db
        .collection("posts")
        .doc(id)
        .collection("likes")
        .get();
    if (likesSnapShot.docs) {
        likesSnapShot.docs.forEach((l:any) => {
        likes.push(l.id);
        });
    }
    const commentsSapShot = await db
        .collection("posts")
        .doc(id)
        .collection("comments")
        .get();
    if (commentsSapShot.docs) {
        commentsSapShot.docs.forEach((c:any) => {
        comments.push({ id: c.id, ...c.data() });
        });
    }
    if (likes.includes(userData.username)) isLiked = true;

    return {
        postData: postData.data(),
        likes,
        comments,
        liked: isLiked
    };
};










export const getLikes = async (postId: string): Promise<string[]> => {
  const likes: string[] = [];
  await api.get("posts", null, { path: postId, collection: "likes" }, (res) => {
    res.docs.forEach((l: any) => likes.push(l.id));
  });
  return likes;
};












export const getComments = async (postId: string): Promise<[]> => {
    const comments: any = [];
    await api.get("posts",null,{ path: postId, collection: "comments" },(res) => {
        res.docs.forEach((c: any) => comments.push({ id: c.id, ...c.data() }));
    });
    return comments;
};











export const disLike = async (id: string, username: string): Promise<null | any> => {
    let response = null;
    await api.del("posts",{ path: id, collection: "likes", doc: { path: username } },(res) => {
        response = res;
    });
    return response;
};











export const addLike = async (id: string, username: string): Promise<null | any> => {
  let isLiked = null;
  let response = null;

    await api.get("posts", null, { path: id, collection: "likes" }, (res) => {
        res.forEach((like: any) => {
        if (like.id === username) isLiked = true;
        });
    });

    if (!isLiked) {
        await api.set("posts",{ path: id, collection: "likes", doc: { path: username } },{ username: username },(res: any) => {
            response = res;
        });
    }
  return response;
};









export const addComment = async (id: string,commentText: string,userData: userDataType): Promise<{}> => {
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











interface getLikesAndCommentsReponse{
    likes: any[];
    comments: any[];
}

export const getLikesAndComments = async (id: string): Promise<getLikesAndCommentsReponse> => {
    const likes: any = await getLikes(id);
    const comments: any = await getComments(id);
    return {
        likes,
        comments,
    };
};