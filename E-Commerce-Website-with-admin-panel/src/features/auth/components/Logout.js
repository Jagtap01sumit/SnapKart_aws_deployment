import React, { useEffect } from "react";

import { selectLoggedInUser, signOutAsync } from "../authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  useEffect(() => {
    dispatch(signOutAsync());
  });
  //but useEffecct runs after render, so we have to delay navigate part
  return (<>{!user && <Navigate to="/login" replace={true}></Navigate>}</>)
}
