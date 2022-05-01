import * as api from "../utilities/api";
import { userDataType } from "../types/user.types";
import { postType } from "../types/post.types";

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

export const getLikesAndComments = async (postInfo: any): Promise<{}> => {
    const likes: any = await getLikes(postInfo.id);
    const comments: any = await getComments(postInfo.id);
    return {
        ...postInfo,
        likes,
        comments,
    };
};