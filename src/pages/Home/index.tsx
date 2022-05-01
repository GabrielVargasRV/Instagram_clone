import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { auth } from "../../firebase";
import Post from "../../components/Post";
import Suggestions from "../../components/Suggestions"
import Loading from "../../components/LoadingInstagram";
import Modal from "../../components/PostModal";
import { getPosts, userDataType, postType } from "../../utilities/utils";
import './styles.css';


interface Props {
  userData: userDataType
  setPostModalInfo:(post:postType) => void;
}

const Home: React.FC<Props> = ({ userData }) => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal,setModal] = useState(null);

  const postModal = (post:postType) => {
    setModal(post);
  }

  useEffect(() => {
    if (userData) {
      getPosts(userData).then((arrOfPosts: any) => {
        setPosts(arrOfPosts)
        setIsLoading(false)
      })
    } else {
      history.push("/");
    }
  }, [userData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Instagram</title>
      </Helmet>
      {userData ? (
        <>
          <div className="Home">
            <div className="posts">
              {posts.length &&
                posts.map((post: any) => (
                  <Post
                    handlePostModal={postModal}
                    postInfo={post}
                    key={post.id}
                  />
                ))}
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
            {modal && (
              <Modal postModalInfo={modal} close={() => setModal(null)} />
            )}
        </>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch: any) => ({
  setPostModalInfo(post:postType){
    dispatch({
      type: "SET_POSTMODAL_INFO",
      postModalInfo:post
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);