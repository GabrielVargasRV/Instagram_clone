import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "../../firebase";
import { connect } from "react-redux";
import Loading from "../LoadingInstagram";

import './styles.css';

import {userDataType,stateType,userType,getUserData } from "../../utilities/utils"

interface Props {
  login:(user: any) => void;
  logout: () => void;
  setUserData:(data:any) => void;
  userData:userDataType;
}

const getActivities = async (userData:userDataType,setActivityData:any) => {
  const activitiesSnapshot = await db
    .collection("userData")
    .doc(userData.uid)
    .collection("activity")
    .get();
  const activitiesArr:any = [];
  activitiesSnapshot.docs.forEach((a) => {
    activitiesArr.push({ id: a.id, ...a.data() });
  });
  setActivityData(activitiesArr);
};

const handleActivityButton = (activityIsOpen:any,setActivityIsOpen:any,userData:userDataType,setActivityData:any) => {
  setActivityIsOpen(!activityIsOpen);
  const activity = document.getElementById("Activity");
  const searchModal = document.getElementById("search-modal");
  getActivities(userData,setActivityData);
  if (activityIsOpen) {
    activity.style.display = "block";
    searchModal.style.display = "none";
  } else {
    activity.style.display = "none";
  }
};

const handleSearch = async (e:any,setUsersSearch:any) => {
  if (e.target.value.length) {
    const searchSnapshot = await db
      .collection("userData")
      .where("username", "<=", e.target.value)
      .limit(15)
      .get();
    const usersSearchArr:any = [];
    searchSnapshot.docs.forEach((u) => {
      usersSearchArr.push(u.data());
    });
    setUsersSearch(usersSearchArr);
  }
};

const Header: React.FC<Props> = ({ login, logout, setUserData, userData }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [activityIsOpen, setActivityIsOpen] = useState(true);
  const [activityData, setActivityData] = useState(null);
  const [usersSearch, setUsersSearch] = useState([]);

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
    }, 300);
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
            setUserData(data);
            setIsLoading(false);
          });
        } else {
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
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png" alt="" />
        </Link>
        <input
          type="text"
          placeholder="🔍Search"
          onBlur={handleOnBlurSearchInput}
          onFocus={handleOnFocusSearchInput}
          onChange={(e) => handleSearch(e,setUsersSearch)}
        />
        <div>
          <Link to="/home" className="link">
            <i className="fas fa-home"></i>
          </Link>
          <Link to="/inbox" className="link">
            <i className="fab fa-facebook-messenger"></i>
          </Link>
          <i onClick={() => handleActivityButton(activityIsOpen,setActivityIsOpen,userData,setActivityData)} className="fas fa-heart"></i>
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
              <div onClick={() => history.push(`/profile/${u.username}`)} className="link">
                <img src={u.photoURL} alt="" />
                <div>
                  <p>{u.username}</p>
                  <p>{u.name}</p>
                </div>
              </div>
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
            activityData.map((act:any) => {
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

const mapStateToProps = (state:stateType) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch:any) => ({
  login(user:userType) {
    dispatch({
      type: "LOGIN",
      user,
    });
  },
  setUserData(userData:userDataType) {
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