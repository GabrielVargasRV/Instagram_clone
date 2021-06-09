import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {follow} from "../database";

const Suggestions = ({ userData }) => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    if (userData.following.length) {
      const users = await db
        .collection("userData")
        .where("username", "not-in", userData.following)
        .limit(5)
        .get();
      const arr = [];
      users.docs.forEach((u) => {
        if (u.data().uid !== userData.uid) {
          arr.push(u.data());
        }
      });
      setUsers(arr);
    } else {
      const users = await db.collection("userData").limit(5).get();
      const arr = [];
      users.docs.forEach((u) => {
        if (u.data().uid !== userData.uid) {
          arr.push(u.data());
        }
      });
      setUsers(arr);
    }
  };

  const handleFollow = async (username, index) => {
    const temp = users;
    temp.splice(index, 1);
    console.log(temp);
    setUsers([...temp]);

    follow(username,userData)

  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="suggestions-container">
      <p className="title">Suggestion for you</p>
      <div>
        {users ? (
          <div>
            {users.map((user, index) => (
              <div className="sugg-user" key={user.uid}>
                <div>
                  <img src={user.photoURL} alt="" />
                  <Link className="link" to={`/profile/${user.username}`}>
                    <p>{user.username}</p>
                  </Link>
                </div>
                <button onClick={() => handleFollow(user.username, index)}>
                  Follow
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
