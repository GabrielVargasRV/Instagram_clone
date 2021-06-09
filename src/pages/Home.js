import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { db, auth } from "../firebase";
import Post from "../components/Post.js";
import PostModal from "../components/Post-Modal.js";
import Suggestions from "../components/Suggestions";
import Loading from "../components/Loading.js";

const Home = ({ userData }) => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postModalIsOpen, setPostModalIsOpen] = useState(true);
  const [postModalInfo, setPostModalInfo] = useState(null);

  const getPosts = async () => {
    const postsArr = [];
    const testPosts = await db
      .collection("posts")
      .where("username", "==", "Instagram")
      .get();
    testPosts.docs.forEach((doc) => {
      postsArr.push({ id: doc.id, ...doc.data() });
    });
    if (userData.following.length) {
      const followingPosts = await db
        .collection("posts")
        .where("username", "in", userData.following)
        .get();
      followingPosts.docs.forEach((doc) => {
        postsArr.push({ id: doc.id, ...doc.data() });
      });
    }
    setPosts(postsArr);
    setIsLoading(false);
  };

  const addLike = async (id) => {
    const likesSnapShot = await db
      .collection("posts")
      .doc(id)
      .collection("likes")
      .get();
    const likes = [];
    likesSnapShot.forEach((like) => {
      likes.push(like.id);
    });
    if (!likes.includes(userData.username)) {
      await db
        .collection("posts")
        .doc(id)
        .collection("likes")
        .doc(userData.username)
        .set({ username: userData.username });
    }
  };

  const disLike = async (id) => {
    await db
      .collection("posts")
      .doc(id)
      .collection("likes")
      .doc(userData.username)
      .delete();
  };

  const addComment = async (id, commentText) => {
    const comment = {
      text: commentText,
      username: userData.username,
      userPhoto: userData.photoURL,
    };
    await db.collection("posts").doc(id).collection("comments").add(comment);
  };

  // const deleteComment = async (id) => {};

  const handlePostModal = (post) => {
    setPostModalIsOpen(!postModalIsOpen);
    setPostModalInfo(post);
    const postModal = document.getElementById("post-modal");
    if (postModalIsOpen) {
      postModal.style.display = "block";
    } else {
      postModal.style.display = "none";
    }
  };

  useEffect(() => {
    if (userData) {
      getPosts();
    } else {
      history.push("/");
    }
  }, [userData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <div id="post-modal" className="post-modal-container">
        <button onClick={() => handlePostModal(null)} className="close-btn">
          <i class="fas fa-times"></i>
        </button>
        {postModalInfo ? (
          <PostModal
            postModalInfo={postModalInfo}
            userData={userData}
            addLike={addLike}
            disLike={disLike}
            addComment={addComment}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Helmet>
        <title>Instagram</title>
      </Helmet>
      {userData ? (
        <div className="Home">
          <button
            className="createpost-btn"
            onClick={() => history.push("/create-post")}
          >
            Create post
          </button>
          <div className="posts">
            {posts.length &&
              posts.map((post) => {
                return (
                  <Post
                    handlePostModal={handlePostModal}
                    postInfo={post}
                    username={userData.username}
                    disLike={disLike}
                    addLike={addLike}
                    key={post.id}
                    addComment={addComment}
                  />
                );
              })}
          </div>
          <div className="suggestions">
            <div className="sugg-header">
              <div>
                <img src={userData.photoURL} alt="" />
                <span>
                  <Link className="link" to={`/profile/${userData.username}`}>
                    <p className="username">{userData.username}</p>
                  </Link>
                  <p className="name">{userData.name}</p>
                </span>
              </div>
              <button onClick={async () => await auth.signOut()}>Switch</button>
            </div>
            <Suggestions />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
