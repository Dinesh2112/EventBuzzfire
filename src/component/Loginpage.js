import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "./Login.module.css";

import InputControl from "./InputControl";
import { auth } from "./firebase";
import logo from "./logo.png";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

const LoginPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("loginEmail");
    if (storedEmail) {
      setValues((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);

    // Save the entered email to local storage
    localStorage.setItem("loginEmail", values.email);

    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.innerBox}>
          <img src={logo} alt="logo" className={styles.logo} />
          <h1 className={styles.heading}>Login</h1>

          <InputControl
            label="Email"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter email address"
          />
          <InputControl
            label="Password"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
            placeholder="Enter Password"
          />

          <div className={styles.footer}>
            <b className={styles.error}>{errorMsg}</b>
            <button
              disabled={submitButtonDisabled}
              onClick={handleSubmission}
              className="signin-btn"
            >
              Login
            </button>

            <div className={styles.googleSignup}>
              <p>or</p>
              <button onClick={signInWithGoogle}>Sign in with Google</button>
            </div>

            <p>
              <br></br>Don't have an account?{" "}
              <span>
                <Link to="/signup">Sign up</Link>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rightSide}></div>
    </div>
  );
};

export default LoginPage;