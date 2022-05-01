import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addComment, handleLike, postType, userDataType } from "../../utilities/utils";
import './styles.css';

interface Props {
  postModalInfo: postType;
  userData: userDataType;
  close: any
}

const PostModal: React.FC<Props> = ({ postModalInfo, userData, close }) => {
  const [isLiked, setIsLiked] = useState(false); 
  const [commentText, setCommentText] = useState("");

  const like = () => handleLike(postModalInfo, isLiked, userData.username, setIsLiked)
  
  const handleComment = () => {
    postModalInfo.comments.push({
      id: 1,
      text: commentText,
      userPhoto: userData.photoURL,
      username: userData.username
    });
    addComment(postModalInfo.id, commentText, userData);
    setCommentText("");
  };

  useEffect(() => {
    const codition = postModalInfo.likes.includes(userData.username);
    codition ? setIsLiked(true) : setIsLiked(false);
  }, [postModalInfo]);

  return (
    <div className="post-modal-container" >
      <button className="close-btn" onClick={close} >
        <i className="fas fa-times"></i>
      </button>
      <div className="post-modal">
        <div className="post-modal--left" style={{ backgroundImage: `url(${postModalInfo.photo})` }} >
        </div>
        <div className="post-modal--right" >
          <div className="header">
            <img src={postModalInfo.userPhoto} alt="" />
            <Link to={`/profile/${postModalInfo.username}`} className="link" >
              {postModalInfo.username}
            </Link>
          </div>
          <div className="bottom" >
            <div className="comments" >
              <div>
                <img src={postModalInfo.userPhoto} alt="" />
                <p>
                  <strong><Link className="link" to={`profile/${postModalInfo.username}`} >{postModalInfo.username}</Link></strong>
                  {postModalInfo.caption}
                </p>
              </div>
              {postModalInfo.comments.map((c: any) => (
                <div key={c.id}>
                  <img src={c.userPhoto} alt="" />
                  <p>
                    <strong><Link className="link" to={`profile/${c.username}`} >{c.username}</Link>  </strong>
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="add-comment" >
              <div>
                {isLiked ? (
                  <i onClick={like} className="fas fa-heart"></i>
                ) : (
                  <i onClick={like} className="far fa-heart"></i>
                )}
                <i className="far fa-comment"></i>
              </div>
              <div>
                <p><strong>{postModalInfo.likes.length}</strong> Likes</p>
              </div>
              <div>
                <input type="text" placeholder="add a comment..." value={commentText} onChange={(e: any) => setCommentText(e.target.value)} />
                <button onClick={handleComment} >Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

const mapStateToProps = (state: any) => ({
  userData: state.userData
})

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
