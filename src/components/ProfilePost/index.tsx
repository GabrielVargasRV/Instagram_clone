import React, { useEffect, useState } from "react";

import {getLikesAndComments} from "../../services/post.services";
import {postType} from "../../utilities/utils"

interface Props {
  postInfo: postType;
  setModal: (post:postType) => void;
}


const ProfilePost: React.FC<Props> = ({ postInfo,setModal }) => {
  const [post, setPost] = useState(null);

  const getData = async () => {
    const {likes,comments} = await  getLikesAndComments(postInfo.id);
    setPost({
      ...postInfo,
      likes,
      comments
    })
  }

  useEffect(() => {
    getData();
  }, []);

  return post ? (
    <button
      onClick={() => setModal(post)}
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

export default ProfilePost;
