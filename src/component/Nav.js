
import React, { useState, useEffect } from "react";
import {  useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as path from "path";
// import {videoCall} from "../features/userSlice";

const NavLinks = (props) =>{
    const dispatch = useDispatch();
console.log(props, "props..")
  let pathname = window.location.pathname;
    useEffect(() => {
        pathname = window.location.pathname;
        // if (pathname !==)/chat   /searching-profile  /video-chat  /answer-calling
        if (pathname !== "/chat" &&
            pathname !== "/searching-profile" &&
            pathname !== "/answer-calling" &&
            !pathname.match("/video-chat")) {
            localStorage.removeItem("videoCallPageRefresh");
            // dispatch(videoCall(null))
        }
    }, [window.location.pathname]);

    return(
         <ul className="feature-menu ml-auto">
              <li className={`${pathname.match('/home') ? 'active' : ''}`}>
                   <Link to="/">
                    <i className="fas fa-compass" />
                    <span>Discover</span>
                  </Link>
                </li>
                <li className={`${pathname.match('/searching-profile') ? 'active' : ''}`}>
                    <Link to="/searching-profile">
                     <i className="fas fa-video" />
                    <span>Video Chat</span>
                  </Link>
                </li>
                <li className={`${pathname.match('/chat') ? 'active' : ''}`}>
                   <Link to="/chat">
                     <i className="fas fa-layer-group" />
                    <span>Activity</span>
                </Link>
                </li>
                <li className={`${pathname.match('/profile') ? 'active' : ''}`}>
                <Link to="/profile">
                    <i className="fas fa-user" />
                    <span>Profile</span>
                </Link>
                </li>
              </ul>
    )
}
export default NavLinks;



