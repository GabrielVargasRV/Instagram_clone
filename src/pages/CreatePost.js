import React, { useState } from "react";
import { connect } from "react-redux";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";

const CreatePost = ({ userData }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    caption: "",
    photo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const post = async (e) => {
    e.preventDefault();
    if (formData.photo.length) {
      const now = Date.now();
      const templateObj = {
        ...formData,
        userPhoto: userData.photoURL,
        username: userData.username,
        uid: userData.uid,
        date: now,
      };
      await db
        .collection("posts")
        .add(templateObj)
        .then((res) => {});
      history.push("/home");
    }
  };

  return (
    <div className="Create-post">
      <form onSubmit={post}>
        <label>
          <p>caption</p>
          <textarea
            cols="30"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          <p>Photo Url</p>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
