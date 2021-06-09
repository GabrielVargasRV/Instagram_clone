import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PostModal = ({ postModalInfo, userData ,addLike, disLike,addComment}) => {
  const [isLiked, setIsLiked] = useState(false);
	const [commentText,setCommentText] = useState("");

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      const tempData = postModalInfo;
      const index = tempData.likes.indexOf(userData.username);
      tempData.likes.splice(index, 1);
      setPost(tempData);
      disLike(postModalInfo.id);
    } else {
      setIsLiked(true);
      const tempData = post;
      tempData.likes.push(username);
      setPost(tempData);
      addLike(postModalInfo.id);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
		postModalInfo.comments.push({
			id:1,
			text:commentText,
			userPhoto:userData.photoURL,
			username:userData.username
		})
    addComment(postModalInfo.id, commentText);
    setCommentText("");
  };

  useEffect(() => {
    if (postModalInfo.likes.includes(userData.username)) {
      setIsLiked(true);
    }
  }, []);

  return (
    <div className="post-modal">
      <div
        className="photo"
        style={{ backgroundImage: `url(${postModalInfo.photo})` }}
      ></div>
      <div className="post-modal-rigth">
        <div className="post-modal-header">
          <img src={postModalInfo.userPhoto} alt="" />
          <Link to={`profile/${postModalInfo.username}`} className="link">
            {postModalInfo.username}
          </Link>
        </div>
        <div className="post-modal-comments">
          {postModalInfo.comments.map((c) => {
            return (
              <div key={c.id}>
                <img src={c.userPhoto} alt="" />
                <p>
                  <strong><Link className="link" to={`profile/${c.username}`} >{c.username}</Link>  </strong>
                  {c.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className="post-modal-addcomment">
          <div>
            {isLiked ? (
              <i onClick={handleLike} className="fas fa-heart"></i>
            ) : (
              <i onClick={handleLike} className="far fa-heart"></i>
            )}
              <i className="far fa-comment"></i>
          </div>
					<p><strong>{postModalInfo.likes.length} likes</strong></p>
					<form onSubmit={handleComment} >
						<textarea  cols="30" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" ></textarea>
						<button type="submit" >Post</button>
					</form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
