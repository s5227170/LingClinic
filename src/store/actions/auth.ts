import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { ThunkAction } from "redux-thunk";
import { RootState } from "..";

import {
  AuthAction,
  SET_AUTH_COMPLETE,
  SET_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  SET_USER,
  SIGN_OUT,
  User,
} from "../types";
import agent from "../../api/agent";
import { auth } from "../../firebase";
import { async } from "@firebase/util";

export const register = (
  email: string,
  forename: string,
  surname: string,
  password: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const authenticator = auth;
    await createUserWithEmailAndPassword(authenticator, email, password)
      .then(async (res) => {
        if (res.user) {
          const token = await res.user.getIdToken(true);
          const createdUser = await agent.user.create(
            res.user.uid,
            email,
            forename,
            surname,
            token
          );
          if (createdUser) {
            dispatch({
              type: SET_USER,
              payload1: createdUser,
              payload2: true,
              payload3: createdUser.type,
              payload4: token,
              payload5: "",
            });
          }
        }
        dispatch(setLoading(false));
      })
      .catch((err) => {
        let errorCode = err.code.split("auth/")[1];
        dispatch(setError(errorCode.replace(/-/g, " ")));
        dispatch(setLoading(false));
      });

    dispatch(setLoading(false));
  };
};

export const login = (
  email: string,
  password: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const authenticator = auth;
    await signInWithEmailAndPassword(authenticator, email, password)
      .then((res) => {
        dispatch(setLoading(false));
        if (res) dispatch(setSuccess("Login successfull."));
      })
      .catch((err) => {
        let errorCode = err.code.split("auth/")[1];
        dispatch(setError(errorCode.replace(/-/g, " ")));
        dispatch(setLoading(false));
      });
    dispatch(setLoading(false));
  };
};

export const getuserbyid = (
  user: any
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const token = await user.getIdToken(true);
      const getUser = await agent.user.details(token);

      let avatar: string = "";
      if (getUser) {
        if (getUser.avatar.length != 0) {
          avatar = await agent.files.downloadAvatar(getUser.avatar, token);
        }
        dispatch({
          type: SET_USER,
          payload1: getUser,
          payload2: true,
          payload3: getUser.type,
          payload4: token,
          payload5: avatar,
        });
      }
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setLoading(false));
      console.log((err as any).message);
      dispatch(setError((err as any).message));
    }
  };
};

export const updateuser = (
  user: User,
  token: string,
  avatar?: File
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    console.log(avatar);

    const formData = new FormData();
    if (avatar) {
      formData.append("file", avatar);

      const uploadAvatar = await agent.files.uploadAvatar(token, formData);
      user.avatar = uploadAvatar;

      const updatedUser = await agent.user.update(user, token).catch((err) => {
        dispatch(setError(err.message));
        dispatch(setLoading(false));
      });
      if (updatedUser) {
        const authenticator = auth;
        dispatch(getuserbyid(authenticator.currentUser));
        dispatch(setSuccess("Update successfull!"));
        dispatch(setLoading(false));
      }
    } else {
      const updatedUser = await agent.user.update(user, token).catch((err) => {
        dispatch(setError(err.message));
        dispatch(setLoading(false));
      });
      if (updatedUser) {
        const authenticator = auth;
        dispatch(getuserbyid(authenticator.currentUser));
        dispatch(setSuccess("Update successfull!"));
        dispatch(setLoading(false));
      }
    }

    dispatch(setLoading(false));
  };
};

export const updateuserpassword = (
  password: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    console.log(password);
    const authenticator = auth;
    dispatch(setLoading(true));
    const user = authenticator.currentUser;
    if (user) {
      await updatePassword(user, password).catch((err) => {
        setError(err);
      });
    }
    dispatch(setSuccess("Password successfully changed."));
    dispatch(setLoading(false));
  };
};

export const logout = (): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const authenticator = auth;
      await signOut(authenticator);
      dispatch({
        type: SIGN_OUT,
      });
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setLoading(false));
      console.log((err as any).message);
      dispatch(setError((err as any).message));
    }
  };
};

export const setLoading = (
  value: boolean
): ThunkAction<void, RootState, null, AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_LOADING,
      payload: value,
    });
  };
};

export const setError = (
  msg: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_ERROR,
      payload: msg,
    });
  };
};

export const setSuccess = (
  msg: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_SUCCESS,
      payload: msg,
    });
  };
};

export const forgotpassword = (
  email: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then((res) => {
        dispatch(setSuccess("A reset email has been successfully sent."));
      })
      .catch((err) => {
        let errorCode = err.code.split("auth/")[1];
        dispatch(setError(errorCode.replace(/-/g, " ")));
        dispatch(setLoading(false));
      });
    dispatch(setLoading(false));
  };
};

export const setAuthComplete = (
  authComplete: boolean
): ThunkAction<void, RootState, null, AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_AUTH_COMPLETE,
      payload: authComplete,
    });
  };
};
