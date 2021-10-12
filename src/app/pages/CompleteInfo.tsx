import React, { useState } from "react";
import { connect } from "react-redux";
import { db } from "../../firebase.js";
import {useHistory} from 'react-router-dom';

import '../../styles/complete-info.css'

import {userDataType,userType,stateType,getUserData} from "../../utilities/utils"

interface Props {
  user:userType
  setUserData: (userData: userDataType) => void
}

const CompleteInfo: React.FC<Props> = ({ user,setUserData }) => {
	const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    gender: "male",
  });

  const handleOnChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createUserData = async (e:any) => {
		e.preventDefault()
		if(formData.name.length > 5 && formData.username.length > 5 && formData.gender.length) {
      const usersWithSameUsername = await db.collection('userData').where('username','==',formData.username).get()
      if(usersWithSameUsername.docs.length){
        return alert('This username already exists, try with another one')
      }
			const templateObj = {
				...formData,
				...user
			};
			await db.collection('userData').doc(user.uid).set(templateObj)
			getUserData(user.uid).then((data:userDataType) => {
        setUserData(data);
        history.push('/home')
      });
		}else{
			alert('Please fill the info')
		}
  };

  return (
    <div className="complete-info">
      {user ? (
        <div>
          <div className="complete-info_header">
            <img src={user.photoURL} alt="" />
            <p>{user.email}</p>
          </div>
          <form onSubmit={createUserData} >
            <label htmlFor="">
              <p>Name</p>
              <input
                type="text" name="name" value={formData.name} onChange={handleOnChange}
              />
            </label>
            <label htmlFor="">
              <p>Username</p>
              <input
                type="text" name="username" value={formData.username} onChange={handleOnChange}
              />
            </label>
            <label htmlFor="">
              <p>Bio</p>
              <textarea
                name="bio" value={formData.bio} onChange={handleOnChange} placeholder="(optional)"
              ></textarea>
            </label>
            <label htmlFor="">
              <p>Gender</p>
              <select
                name="gender" value={formData.gender} onChange={handleOnChange}
              >
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
            </label>
            <button type="submit">Save</button>
          </form>
        </div>
      ) : (
        <div>User Not Found</div>
      )}
    </div>
  );
};

const mapStateToProps = (state:stateType) => ({
  user: state.user,
});
const mapDispatchToProps = (dispatch:any) => ({
	setUserData(userData:userDataType){
		dispatch({
			type:"SET_USERDATA",
			userData:userData
		})
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(CompleteInfo);
