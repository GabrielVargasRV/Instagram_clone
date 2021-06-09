import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import Loading from "../components/Loading";

const PostPage = ({ userData }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoading,setIsLoading] = useState(true);

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      const tempData = post;
      const index = tempData.likes.indexOf(userData.username);
      tempData.likes.splice(index, 1);
      setPost(tempData);
      await db
        .collection("posts")
        .doc(id)
        .collection("likes")
        .doc(userData.username)
        .delete();
    } else {
      setIsLiked(true);
      const tempData = post;
      tempData.likes.push(userData.username);
      setPost(tempData);
      await db
        .collection("posts")
        .doc(id)
        .collection("likes")
        .doc(userData.username)
        .set({ username: userData.username });
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    const comment = {
      text: commentText,
      username: userData.username,
      userPhoto: userData.photoURL,
			id:commentText
    };
    await db.collection("posts").doc(id).collection("comments").add(comment);
		setCommentText('');
		const temp = post.comments
		temp.push(comment)
		setPost({
			...post,
			comments:temp
		})
  };

  const getPost = async () => {
    const postData = await db.collection("posts").doc(id).get();
    const likesSnapShot = await db
      .collection("posts")
      .doc(id)
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
      .doc(id)
      .collection("comments")
      .get();
    const comments = [];
    if (commentsSapShot.docs) {
      commentsSapShot.docs.forEach((c) => {
        comments.push({ id: c.id, ...c.data() });
      });
    }
    if (likes.includes(userData.username)) {
      setIsLiked(true);
    }
    setPost({
      ...postData.data(),
      likes,
      comments,
    });
    setIsLoading(false)
  };

  useEffect(() => {
    getPost();
  }, []);

  if(isLoading){
    return <Loading/>
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Instagram - Post</title>
      </Helmet>
      {post ? (
        <div className="Post-page">
          <div
            className="post-page_l"
            style={{ backgroundImage: `url(${post.photo})` }}
          ></div>
          <div className="post-page_r">
            <div className="post-page_header">
              <img src={post.userPhoto} alt="" />
              <p>{post.username}</p>
            </div>
            <div className="post-page_comments">
              {post.comments.length &&
                post.comments.map((comment) => {
                  return (
                    <div className="post-page_comment" key={comment.id}>
                      <img src={comment.userPhoto} alt="" />
                      <div>
                        <p>
                          <strong>{comment.username}</strong>
                        </p>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="post-page_footer">
              <div className="buttons">
                {isLiked ? (
                  <i onClick={handleLike} className="fas fa-heart"></i>
                ) : (
                  <i onClick={handleLike} className="far fa-heart"></i>
                )}
                <i className="far fa-comment"></i>
              </div>
							<p><strong>{post.likes.length} likes</strong></p>
              <div className="add-comment">
                <form onSubmit={addComment}>
                  <textarea
                    cols="30"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button type="submit">Post</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
