import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { auth, googleProvider, db } from "../firebase";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const Login = ({ user, userData, logout }) => {
  const history = useHistory();

  const loginWithGoogle = async () => {
    await auth.signOut();
    logout();
    const res = await auth.signInWithPopup(googleProvider);
    const user = await db.collection("userData").doc(res.user.uid).get();
    if (user.exists) {
      history.push("/home");
    } else {
      history.push("/com-info");
    }
  };

  const switchAccount = async () => {
    await auth.signOut();
    logout();
  };

  useEffect(() => {
    if (user) {
    }
  }, []);

  return (
    <div className="Login">
      <Helmet>
        <title>Instagram - Login</title>
      </Helmet>
      {userData ? (
        <div>
          <h1>Instagram</h1>
          <img src={userData.photoURL} alt="" />
          <button onClick={() => history.push("/home")}>
            continue as {userData.username}
          </button>
          <span>
            Not {userData.username} ?{" "}
            <a onClick={switchAccount}>switch account</a>
          </span>
        </div>
      ) : (
        <div className="">
          <h1>Login with Google</h1>
          <button onClick={loginWithGoogle}>Login</button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  userData: state.userData,
});
const mapDispatchToProps = (dispatch) => ({
  login(user) {
    dispatch({
      type: "LOGIN",
      user,
    });
  },
  logout() {
    dispatch({
      type: "LOGOUT",
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
