import React, { useContext } from "react";
import { NavLink, Navigate } from "react-router-dom";

import Auth from "../../../users/pages/Auth";
import { AuthContext } from "../../context/auth-context";

import "./NavLink.css";

const NavLinks = (props) => {

  const auth  = useContext(AuthContext);


  return (
    <ul className="nav-links">
      <li><NavLink to="/">ALL USERS</NavLink></li>

      {/* show this nav bar text with its embedded link only when a user is logged in
      tracked with a auth-context created with login == false and login and logout 
      both as fns 
      in app we imported it, use a useState to change when to login or logout
      then we finally passed those values here */}
      {auth.isLoggedIn && (
        <li> <NavLink to={`/${auth.userId}}/places`}>MY PLACES</NavLink></li>
      )}
      
      {/* // "/u1/places" //before*/} 

      {auth.isLoggedIn && (
        <li> <NavLink to={`/${auth.userId}/places/new`}>ADD PLACE</NavLink></li>
      )}

      {!auth.isLoggedIn && (
        <li> <NavLink to="/auth">AUTHENTICATE</NavLink> </li>
      )}
      {/* here we need button becasue onclicking we do not want to be routed but we want a fn to be invoked */}
      {/* using navlink around button prevented the page from loading */}
      {auth.isLoggedIn && (
        <li><button onClick={auth.logout}>LOGOUT</button></li>
      )}

      {/* {auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">WELCOME USER</NavLink>
        </li>
      )} */}
    </ul>
  );
};

export default NavLinks;

//here we wanted to use our context
//so we import useContext to enable use use our created contex AuthContext
//we wrap our AuthContext with useContext
//and we go ahead to block the link that we dont want to appear

//then we say when you are not logged in, display authenticate
//hide myplace and addplace which is reserved for users
//but non users can come and see all pictures

//i did it!
//wanting a way to route back to auth after log out
//i decided to wrap our button that dispalys LOG OUT instead of our usual NAVLINK
//becasue we seend to submit or invoke a fn hence we went with a button
//then within the button i call NAVLINK to handle the routing so that after every logout whereveree we are, it should send us back to the authenticate
