import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Loading from "../components/Loading";
import ProfilePost from "../components/ProfilePost.js";
import { getProfile, follow, unFollow, createChat } from "../database";

const Profile = ({ userData }) => {
  const { username } = useParams();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [postModalIsOpen, setPostModalIsOpen] = useState(true);
  const [postModalInfo, setPostModalInfo] = useState(null);

  const handleFollow = async () => {
    await follow(username, userData);
    setFollowing(true);
  };

  const handleUnFollow = async () => {
    await unFollow(profile.uid, username, userData.uid, userData.username);
    setFollowing(false);
  };

  const handleSendMessege = async () => {
    createChat(profile, userData).then((id) => {
      history.push(`/inbox/${id}`);
    });
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
    getProfile(username, userData.username).then((res) => {
      setProfile(res);
      res.followers.forEach((f) => {
        if (f.username === userData.username) {
          setFollowing(true);
        }
      });
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>Instagram - {username}</title>
      </Helmet>
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
      {profile ? (
        <div className="Profile">
          <div className="Profile-header">
            <div className="Profile-header_left">
              <img src={profile.photoURL} alt="" />
            </div>
            <div className="Profile-header_right">
              <div>
                <h2>{profile.username}</h2>
                {username !== userData.username && (
                  <div>
                    <button onClick={handleSendMessege}>Messege</button>
                    {following ? (
                      <button onClick={handleUnFollow}>Unfollow</button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        style={{ backgroundColor: "#0095f6", color: "white" }}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div>
                <p>
                  <strong>{profile.posts.length}</strong> posts
                </p>
                <p>
                  <strong>{profile.followers.length}</strong> followers
                </p>
                <p>
                  <strong>{profile.following.length}</strong> following
                </p>
              </div>
              <div>
                <p>{profile.bio}</p>
              </div>
            </div>
          </div>
          {profile.posts.length ? (
            <div className="Profile-posts">
              {profile.posts.map((post) => {
                return (
                  <ProfilePost
                    postInfo={post}
                    handlePostModal={handlePostModal}
                  />
                );
              })}
            </div>
          ) : (
            <div
              style={{
                height: 50 + "vh",
                display: "grid",
                placeItems: "center",
                marginTop: 10 + "px",
                borderRadius: 4 + "px",
                backgroundColor: "#fff",
              }}
            >
              <h2>Start capturing and sharing your moments.</h2>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
