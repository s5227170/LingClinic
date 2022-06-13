import {
  AuthAction,
  AuthState,
  SET_AUTH_COMPLETE,
  SET_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  SET_USER,
  SIGN_OUT,
} from "../types";

const initialState: AuthState = {
  user: null,
  userAvatar: "",
  authenticated: false,
  loading: false,
  error: "",
  successAuth: "",
  authChecked: false,
  userType: "",
  authToken: null,
  authComplete: false,
};

export default (state = initialState, action: AuthAction) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload1,
        authenticated: action.payload2,
        userType: action.payload3,
        loading: false,
        authToken: action.payload4,
        userAvatar: action.payload5,
      };
    case SIGN_OUT:
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SET_SUCCESS:
      return {
        ...state,
        successAuth: action.payload,
        loading: false,
      };
    case SET_AUTH_COMPLETE:
      return {
        ...state,
        authComplete: action.payload,
      };
    default:
      return state;
  }
};
