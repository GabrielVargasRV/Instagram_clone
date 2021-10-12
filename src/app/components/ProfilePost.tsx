import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { connect } from "react-redux";

import {postType} from "../../utilities/utils"

interface Props {
  postInfo: postType;
  setPostModal: (post:postType) => void;
}

const ProfilePost: React.FC<Props> = ({ postInfo,setPostModal }) => {
  const [post, setPost] = useState(null);

  const getLikesAndComments = async () => {
    const likesSnapShot = await db
      .collection("posts")
      .doc(postInfo.id)
      .collection("likes")
      .get();
    const likes:any = [];
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
    const comments:any = [];
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
      onClick={() => setPostModal(post)}
      className="Profile-post"
      style={{ backgroundImage: `url(${post.photo})` }}
    >
      <div className="content">
        <div>
          <i className="fas fa-heart"></i>
          <p>{post.likes.length}</p>
        </div>
        <div>
          <i className="fas fa-comment"></i>
          <p>{post.comments.length}</p>
        </div>
      </div>
    </button>
  ) : (
    <div className="lds-spinner">
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

const mapStateToProps = (state:any) => ({})

const mapDispatchToProps = (dispatch:any) => ({
  setPostModal(post:postType){
    dispatch({
      type:"SET_POSTMODAL_INFO",
      postModalInfo:post
    })
  }
})

export default connect(mapStateToProps,mapDispatchToProps)(ProfilePost);
