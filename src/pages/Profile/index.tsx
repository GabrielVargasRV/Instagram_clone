import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Loading from "../../components/LoadingInstagram";
import ProfilePost from "../../components/ProfilePost";

import './styles.css';

import { postType, stateType, userDataType, getProfile, follow, unFollow, createChat } from '../../utilities/utils'

interface ProfileInfoProps {
  profile: any;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  return (
    <>
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
    </>
  )
}

interface ProfileHeaderProps {
  children: any;
  profile: any;
  userData: userDataType;
  username: string;
  following: any;
  setFollowingProp: (value: any) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ children, profile, userData, username, following, setFollowingProp }) => {
  const history = useHistory();

  const handleFollow = async () => {
    await follow(username, userData);
    setFollowingProp(true);
  };

  const handleUnFollow = async () => {
    await unFollow(profile.uid, username, userData.uid, userData.username);
    setFollowingProp(false);
  };

  const handleSendMessege = async () => {
    createChat(profile, userData).then((id: string) => {
      history.push(`/inbox/${id}`);
    });
  };

  return (
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
        {children}
      </div>
    </div>
  )
}

interface ProfileProps {
  userData: userDataType
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const { username } = useParams<any>();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [following, setFollowing] = useState<any>(false);

  useEffect(() => {
    getProfile(username).then((res) => {
      setProfile(res);
      res.followers.forEach((f: any) => {
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
      {profile ? (
        <div className="Profile">
          <ProfileHeader
            profile={profile}
            userData={userData}
            username={username}
            following={following}
            setFollowingProp={setFollowing}
          >
            <ProfileInfo profile={profile} />
          </ProfileHeader>
          {profile.posts.length ? (
            <div className="Profile-posts">
              {profile.posts.map((post: postType) => {
                return (
                  <ProfilePost
                    postInfo={post}
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

const mapStateToProps = (state: stateType) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
