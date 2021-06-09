import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import { connect } from "react-redux";
import Loading from "./Loading";
import { getUserData } from "../database";

const Header = ({ login, logout, setUserData, userData }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [activityIsOpen, setActivityIsOpen] = useState(true);
  const [activityData, setActivityData] = useState(null);
  const [usersSearch, setUsersSearch] = useState([]);

  const handleActivityButton = () => {
    setActivityIsOpen(!activityIsOpen);
    const activity = document.getElementById("Activity");
    const searchModal = document.getElementById("search-modal");
    getActivities();
    if (activityIsOpen) {
      activity.style.display = "block";
      searchModal.style.display = "none";
    } else {
      activity.style.display = "none";
    }
  };

  const getActivities = async () => {
    const activitiesSnapshot = await db
      .collection("userData")
      .doc(userData.uid)
      .collection("activity")
      .get();
    const activitiesArr = [];
    activitiesSnapshot.docs.forEach((a) => {
      activitiesArr.push({ id: a.id, ...a.data() });
    });
    setActivityData(activitiesArr);
  };

  const handleSearch = async (e) => {
    if (e.target.value.length) {
      const searchSnapshot = await db
        .collection("userData")
        .where("username", "<=", e.target.value)
        .limit(15)
        .get();
      const usersSearchArr = [];
      searchSnapshot.docs.forEach((u) => {
        usersSearchArr.push(u.data());
      });
      setUsersSearch(usersSearchArr);
    }
  };

  const handleOnFocusSearchInput = () => {
    const activity = document.getElementById("Activity");
    const searchModal = document.getElementById("search-modal");
    searchModal.style.display = "block";
    activity.style.display = "none";
  };

  const handleOnBlurSearchInput = () => {
    const searchModal = document.getElementById("search-modal");
    setTimeout(() => {
      searchModal.style.display = "none";
    }, 100);
  };

  useEffect(() => {
    (async () => {
      await auth.onAuthStateChanged((u) => {
        if (u) {
          const user = {
            displayName: u.displayName,
            photoURL: u.photoURL,
            email: u.email,
            uid: u.uid,
          };
          login(user);
          getUserData(user.uid).then((data) => {
            console.log(data)
            setUserData(data);
            setIsLoading(false);
          });
        } else {
          console.log('logout')
          logout();
          history.push("/");
          setIsLoading(false);
        }
      });
    })();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="Header-container">
      <div className="Header">
        <Link to="/home" className="title">
          Instagram
        </Link>
        <input
          type="text"
          placeholder="🔍Search"
          onBlur={handleOnBlurSearchInput}
          onFocus={handleOnFocusSearchInput}
          onChange={handleSearch}
        />
        <div>
          <Link to="/home" className="link">
            <i className="fas fa-home"></i>
          </Link>
          <Link to="/inbox" className="link">
            <i className="fab fa-facebook-messenger"></i>
          </Link>
          <i onClick={handleActivityButton} class="fas fa-heart"></i>
          {userData && (
            <Link to="/">
              <img src={userData.photoURL} alt="" />
            </Link>
          )}
        </div>
      </div>
      <div id="search-modal" className="search-modal">
        {usersSearch.length ? (
          usersSearch.map((u) => {
            return (
              <Link to={`/profile/${u.username}`} className="link">
                <img src={u.photoURL} alt="" />
                <div>
                  <p>{u.username}</p>
                  <p>{u.name}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{width: 100+"%",height:100+"%",display:'grid', placeItems: "center"}} >
            <h4 style={{color:"#C2C2C2"}} >Not users Found</h4>
          </div>
        )}
      </div>
      <div id="Activity" className="Activity">
        {activityData ? (
          activityData.length ? (
            activityData.map((act) => {
              return (
                <div>
                  <p>
                    <strong>{act.username}</strong> started following you.
                  </p>
                </div>
              );
            })
          ) : (
          <div style={{width: 100+"%",height:100+"%",display:'grid', placeItems: "center"}} >
            <h4 style={{color:"#C2C2C2"}} >you have no notifications</h4>
          </div>
          )
        ) : (
          <div style={{width: 100+"%",height:100+"%",display:'grid', placeItems: "center"}} >
            <h4>Loading...</h4>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch) => ({
  login(user) {
    dispatch({
      type: "LOGIN",
      user,
    });
  },
  setUserData(userData) {
    dispatch({
      type: "SET_USERDATA",
      userData: userData,
    });
  },
  logout() {
    auth.signOut();
    dispatch({
      type: "LOGOUT",
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
