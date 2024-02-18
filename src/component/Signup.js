import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import styles from "./Signup.module.css";
import InputControl from "./InputControl";
import { auth } from "./firebase";
import logo from "./logo.png";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const signupWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Redirect to the home page after successful Google signup
        navigate("/");
      })
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.innerBox}>
          <img src={logo} alt="logo" className={styles.logo} />
          <h1 className={styles.heading}>Create Account</h1>

          <InputControl
            label="Name"
            placeholder="Enter your name"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <InputControl
            label="Email"
            placeholder="Enter email address"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <InputControl
            label="Password"
            type="password"  // Set the type to "password"
            placeholder="Enter password"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
          />

          <hr className={styles.divider} />

          <button className="signin-btn" onClick={handleSubmission} disabled={submitButtonDisabled}>
            Signup
          </button>

          <div className={styles.googleSignup}>
            <p>or</p>
            <button onClick={signupWithGoogle}>Signup with Google</button>
          </div>

          <div className={styles.footer}>
            <b className={styles.error}>{errorMsg}</b>
            <p>
              Already have an account?{" "}
              <span>
                <Link to="/login">Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rightSide}></div>
    </div>
  );
};

export default Signup;
