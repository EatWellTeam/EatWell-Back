// import React, { useState } from "react";
// import { Form, Button, Alert } from "react-bootstrap";
// import "./login.css";
// import BackgroundImage from "../assets/background.png";
// import Logo from "../assets/logo.png";

// import Google from "../assets/google.png";
// import Facebook from "../assets/facebook.png";
// import Github from "../assets/github.png";

// const Login = () => {
//   const google = () => {
//     window.open("http://localhost:5000/auth/google", "_self");
//   };

//   const facebook = () => {
//     window.open("http://localhost:5000/auth/facebook", "_self");
//   };

//   const [inputUsername, setInputUsername] = useState("");
//   const [inputPassword, setInputPassword] = useState("");

//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (event: { preventDefault: () => void }) => {
//     event.preventDefault();
//     setLoading(true);
//     await delay(500);
//     console.log(`Username :${inputUsername}, Password :${inputPassword}`);
//     if (inputUsername !== "admin" || inputPassword !== "admin") {
//       setShow(true);
//     }
//     setLoading(false);
//   };

//   const handlePassword = () => {};

//   function delay(ms: number | undefined) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   return (
//     <div className="login">
//       <div className="myWrapper">
//         <h1 className="loginTitle mt-5">Login to AD Social</h1>
//         <div className="center">
//           <div className="line" />
//           {/* <div className="or">OR</div> */}
//         </div>
//         <div className="details">
//           <input
//             type="text"
//             placeholder="Email"
//             className="custom-input"
//             style={{ borderRadius: "10px" }}
//           />
//           <input
//             type="text"
//             placeholder="Password"
//             className="custom-input mb-3"
//           />
//         </div>
//         <div className="left">
//           <button className="loginButton adLogin">Login</button>
//           <div className="loginButton google" onClick={google}>
//             <img src={Google} alt="" className="icon" />
//             Google
//           </div>
//           <div className="loginButton facebook" onClick={facebook}>
//             <img src={Facebook} alt="" className="icon" />
//             Facebook
//           </div>
//           <div className="register">
//             <span className="mx-1">New user?</span>
//             <a href="/register">Register</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
