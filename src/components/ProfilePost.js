import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";

const ProfilePost = ({ postInfo, handlePostModal }) => {
  const [post, setPost] = useState(null);

  const getLikesAndComments = async () => {
    const likesSnapShot = await db
      .collection("posts")
      .doc(postInfo.id)
      .collection("likes")
      .get();
    const likes = [];
    if (likesSnapShot.docs) {
      likesSnapShot.docs.forEach((l) => {
        likes.push(l.id);
      });
    }
    const commentsSapShot = await db
      .collection("posts")
      .doc(postInfo.id)
      .collection("comments")
      .get();
    const comments = [];
    if (commentsSapShot.docs) {
      commentsSapShot.docs.forEach((c) => {
        comments.push({ id: c.id, ...c.data() });
      });
    }
    setPost({
      ...postInfo,
      likes,
      comments,
    });
  };

  useEffect(() => {
    getLikesAndComments();
  }, []);

  return post ? (
    <button
      onClick={() => handlePostModal(post)}
      className="Profile-post"
      style={{ backgroundImage: `url(${post.photo})` }}
    >
      <div className="content">
        <div>
          <i className="fas fa-heart"></i>
          <p>{post.likes.length}</p>
        </div>
        <div>
          <i class="fas fa-comment"></i>
          <p>{post.comments.length}</p>
        </div>
      </div>
    </button>
  ) : (
    <div class="lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default ProfilePost;
