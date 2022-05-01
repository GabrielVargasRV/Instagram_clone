import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import Loading from "../components/Loading";

import '../../styles/post-page.css'

import { addComment,userDataType,handleLike,stateType } from "../utilities/utils";

interface Props {
  userData:userDataType
}

const PostPage: React.FC<Props> = ({ userData }) => {
  const { id } = useParams<any>();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoading,setIsLoading] = useState(true);

;
  const like = () => {
    handleLike(post,isLiked,userData.username,setIsLiked).then((res:any) => setPost(res))
  }

  const handleComment = async (e:any) => {
    e.preventDefault();
    await addComment(id,commentText,userData)
		setCommentText('');
		const temp = post.comments
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
    const likes:any = [];
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
    const comments:any = [];
    if (commentsSapShot.docs) {
      commentsSapShot.docs.forEach((c:any) => {
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
                post.comments.map((comment:any) => {
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
                  <i onClick={like} className="fas fa-heart"></i>
                ) : (
                  <i onClick={like} className="far fa-heart"></i>
                )}
                <i className="far fa-comment"></i>
              </div>
							<p><strong>{post.likes.length} likes</strong></p>
              <div className="add-comment">
                <form onSubmit={handleComment}>
                  <textarea
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

const mapStateToProps = (state:stateType) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch:any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
