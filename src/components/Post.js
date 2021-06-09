import React, { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { Link } from "react-router-dom";

const Post = ({ postInfo, username, addLike, disLike, addComment,handlePostModal }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [post, setPost] = useState({});
  const [commentText,setCommentText] = useState('');

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
    if (likes.includes(username)) {
      setIsLiked(true);
    }
    setPost({
      ...postInfo,
      likes,
      comments,
    });
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      const tempData = post;
      const index = tempData.likes.indexOf(username);
      tempData.likes.splice(index, 1);
      setPost(tempData);
      disLike(postInfo.id);
    } else {
      setIsLiked(true);
      const tempData = post;
      tempData.likes.push(username);
      setPost(tempData);
      addLike(postInfo.id);
    }
  };

	const handleComment = (e) => {
		e.preventDefault()
		addComment(post.id,commentText)
		setCommentText('')
	}

  useEffect(() => {
    getLikesAndComments();
  }, []);

  return (
    <React.Fragment>
      {post.username && (
        <div className="post" key={post.id}>
          <div className="post-header">
            <img src={post.userPhoto} alt="" />
            <Link className="link" to={`/profile/${post.username}`} ><p>{post.username}</p></Link>
          </div>
          <img className="post-img" src={post.photo} alt="" />
          <div className="post-footer">
            <div className="buttons">
              {isLiked ? (
                <i onClick={handleLike} className="fas fa-heart"></i>
              ) : (
                <i onClick={handleLike} className="far fa-heart"></i>
              )}
              <i className="far fa-comment"></i>
            </div>
            <p>
              <strong>{post.likes.length} likes</strong>
            </p>
            <p>
              <strong>{post.username}</strong> {post.caption.length < 45 ? post.caption : `${post.caption.substr(0,42)}...`}
            </p>
            {post.comments.length ? (
              <div>
                {post.comments.length >=2 && (<p style={{cursor:"pointer"}} onClick={() => handlePostModal(post)} >View all {post.comments.length} comments</p>)
								}
                <p>
                  <strong>
                    {post.comments[0].username}
                  </strong> {" "}
                  {post.comments[0].text.length < 35 ? post.comments[0].text : `${post.comments[0].text.substr(0,32)}...`}
                </p>
              </div>
            ) : (
              <div></div>
            )}
            <div className="add-comment">
              <form onSubmit={handleComment} >
                <textarea
                  name="comment"
                  cols="30"
                  placeholder="Add a comment..."
									value={commentText}
									onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <button type="submit" >Post</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default React.memo(Post);
