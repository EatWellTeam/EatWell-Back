// import React, { useState, ChangeEvent } from "react";
// import { Form, Button, Alert } from "react-bootstrap";
// import BackgroundImage from "../assets/background.png";
// import profileImg from "../assets/profile.png";
// const Register = () => {
//   const initialUser = {
//     email: "testuser@example.com",
//     password: "testpassword",
//     profileImage: profileImg,
//   };
//   const [inputEmail, setInputEmail] = useState(initialUser.email);
//   const [inputPassword, setInputPassword] = useState(initialUser.password);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(
//     initialUser.profileImage
//   );
//   const [isEditing, setIsEditing] = useState(false);
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const handleEdit = () => {
//     setIsEditing(true);
//   };
//   const handleSubmit = async (event: { preventDefault: () => void }) => {
//     event.preventDefault();
//     // Validate email
//     if (!validateEmail(inputEmail)) {
//       alert("Invalid email format");
//       return;
//     }
//     // Validate password
//     if (!validatePassword(inputPassword)) {
//       alert("Password must be at least 6 characters long");
//       return;
//     }
//     setLoading(true);
//     await delay(500);
//     console.log(`Email: ${inputEmail}, Password: ${inputPassword}`);
//     if (inputEmail !== "admin" || inputPassword !== "admin") {
//       setShow(true);
//       setIsEditing(false); // Exit editing mode after successful submission
//     }
//     setLoading(false);
//   };
//   const handlePassword = () => {
//     // Handle password logic if needed
//   };
//   const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const selectedFile = event.target.files[0];
//       setSelectedImage(selectedFile);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };
//   const validateEmail = (email: string) => {
//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };
//   const validatePassword = (password: string) => {
//     // Basic password validation (at least 6 characters)
//     return password.length >= 6;
//   };
//   function delay(ms: number | undefined) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }
//   return (
//     <div className="login">
//       <div className="myWrapper">
//         <h1 className="loginTitle mt-5">Profile</h1>
//         <div className="center">
//           <div className="line" />
//         </div>
//         <div className="details">
//           <input
//             type="text"
//             placeholder="Email"
//             className="custom-input"
//             style={{ borderRadius: "10px" }}
//             value={inputEmail}
//             onChange={(e) => setInputEmail(e.target.value)}
//             readOnly={!isEditing}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="custom-input mb-3"
//             value={inputPassword}
//             onChange={(e) => setInputPassword(e.target.value)}
//             readOnly={!isEditing}
//           />
//           {isEditing && (
//             <>
//               <label htmlFor="profile-image" className="btn btn-outline-dark">
//                 Choose Profile Image
//               </label>
//               <input
//                 id="profile-image"
//                 type="file"
//                 accept="image/*"
//                 className="custom-input"
//                 style={{
//                   visibility: "hidden",
//                   width: "0px",
//                   height: "0px",
//                   padding: "0px",
//                 }}
//                 onChange={handleImageChange}
//               />
//             </>
//           )}
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Image Preview"
//               style={{
//                 maxWidth: "100px",
//                 maxHeight: "100px",
//                 marginBottom: "20px",
//                 width: "100%",
//                 height: "auto",
//               }}
//             />
//           )}
//         </div>
//         <div className="left">
//           {isEditing ? (
//             <button
//               className="loginButton adLogin bg-warning"
//               onClick={handleSubmit}
//             >
//               Save
//             </button>
//           ) : (
//             <button
//               className="loginButton adLogin bg-warning"
//               onClick={handleEdit}
//             >
//               Edit
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Register;
//# sourceMappingURL=Profile.js.map