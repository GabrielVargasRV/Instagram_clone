import { createStore } from "redux";

const initialState = {
  user: null,
  userData:null,
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
  }
  return state;
};

const store = createStore(reducer);
export default store;
