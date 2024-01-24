import React, { useState, ChangeEvent } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import BackgroundImage from "../assets/background.png";
import profileImg from "../assets/profile.png";

const Register = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(profileImg);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    await delay(500);
    console.log(`Email: ${inputEmail}, Password: ${inputPassword}`);

    if (inputEmail !== "admin" || inputPassword !== "admin") {
      setShow(true);
    }
    setLoading(false);
  };

  const handlePassword = () => {
    // Handle password logic if needed
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setSelectedImage(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  function delay(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="login">
      <div className="myWrapper">
        <h1 className="loginTitle mt-5">Register to AD Social</h1>
        <div className="center">
          <div className="line" />
        </div>
        <div className="details">
          <input
            type="text"
            placeholder="Email"
            className="custom-input"
            style={{ borderRadius: "10px" }}
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            className="custom-input mb-3"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />

          <label htmlFor="profile-image" className="btn btn-outline-dark">
            Select Profile Image
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="custom-input"
            style={{
              visibility: "hidden",
              width: "0px",
              height: "0px",
              padding: "0px",
            }}
            onChange={handleImageChange}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                marginBottom: "20px",
              }}
            />
          )}
        </div>
        <div className="left">
          <button className="loginButton adLogin" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
