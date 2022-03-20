import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Register from "./Register";
import Login from "./Login";

import "./styles/Auth.scss";
import { useNavigate } from "react-router-dom";

interface IProps {
  auth: string;
  handleAuthChange: (username: string) => void;
}

const Auth = ({ auth, handleAuthChange }: IProps) => {
  const [showRegister, setShowRegister] = useState<boolean>(false);
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (auth !== "") return navigate("/todo/main");

      const res = await fetch("http://cynicade.xyz/todo/api/login", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.message === "logged in successfully") {
        handleAuthChange(data.username);
        return navigate("/todo/main");
      }
    })();
  }, [auth, navigate, handleAuthChange]);

  const handleSwitchClick = (): void => {
    setShowRegister(!showRegister);
  };

  return (
    <motion.div
      className="Auth_container"
      initial={{ y: "-100vh" }}
      animate={{ y: 0 }}
      exit={{ y: "-100vh" }}
    >
      {!showRegister && (
        <Login
          handleSigninClick={handleSwitchClick}
          handleAuthChange={handleAuthChange}
        />
      )}
      {showRegister && (
        <Register
          handleSigninClick={handleSwitchClick}
          handleAuthChange={handleAuthChange}
        />
      )}
    </motion.div>
  );
};

export default Auth;
