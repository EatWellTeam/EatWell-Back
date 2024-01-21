import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import BackgroundImage from "../assets/background.png";
import Logo from "../assets/logo.png";

import Google from "../assets/google.png";
import Facebook from "../assets/facebook.png";
import Github from "../assets/github.png";

const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const facebook = () => {
    window.open("http://localhost:5000/auth/facebook", "_self");
  };

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    await delay(500);
    console.log(`Username :${inputUsername}, Password :${inputPassword}`);
    if (inputUsername !== "admin" || inputPassword !== "admin") {
      setShow(true);
    }
    setLoading(false);
  };

  const handlePassword = () => {};

  function delay(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="login">
      <h1 className="loginTitle">Choose a Login Method</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="" className="icon" />
            Google
          </div>
          <div className="loginButton facebook" onClick={facebook}>
            <img src={Facebook} alt="" className="icon" />
            Facebook
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <div className="right">
          <input
            type="text"
            placeholder="Username"
            className="custom-input"
            style={{ borderRadius: "10px" }}
          />
          <input type="text" placeholder="Password" className="custom-input" />
          <button className="submit">Login</button>
          <button className="submit register">Register</button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Login;
