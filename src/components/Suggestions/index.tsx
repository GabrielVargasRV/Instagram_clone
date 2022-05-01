import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import './styles.css';

import {userDataType,stateType,follow} from "../../utilities/utils"
import {getUsers} from "../../services/user.services";

interface Props {
  userData:userDataType
}

const Suggestions: React.FC<Props> = ({ userData }) => {
  const [users, setUsers] = useState([]);


  const getData = async () => {
    let response = await getUsers(userData);
    setUsers(response);
  }

  const handleFollow = async (username:string, index:any) => {
    const temp = users;
    temp.splice(index, 1);
    setUsers([...temp]);

    follow(username,userData)

  };

  useEffect(() => {
    getData();
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

const mapStateToProps = (state:stateType) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch:any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
