import { createStore } from "redux";

const initialState = {
  user: null,
  userData:null,
  postModalInfo:null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.user,
      };
    case "SET_USERDATA":
      return {
        ...state,
        userData: action.userData,
      };
		case "LOGOUT":
			return{
				...initialState
			}
    case "SET_POSTMODAL_INFO":
      return{
        ...state,
        postModalInfo:action.postModalInfo
      }
  }
  return state;
};

const store = createStore(reducer);
export default store;
