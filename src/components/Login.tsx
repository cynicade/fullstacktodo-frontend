import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import "./styles/Auth.scss";
import { useNavigate } from "react-router-dom";

interface IFormInputs {
  email: string;
  password: string;
}

interface IProps {
  handleSigninClick: () => void;
  handleAuthChange: () => void;
}

const Login = ({
  handleSigninClick,
  handleAuthChange,
}: IProps): JSX.Element => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<IFormInputs> = async user => {
    const res = await fetch("http://cynicade.xyz/todo/api/login", {
      // const res = await fetch("http://localhost:3001/todo/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });

    const data = await res.json();

    if (data.message === "logged in successfully") {
      handleAuthChange();
      return navigate("/todo/main");
    }
  };

  return (
    <motion.div
      className="Auth"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <form className="Auth_form" onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign in</h1>
        <input
          {...register("email", {
            required: true,
            maxLength: 80,
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          placeholder="Email"
        />
        {errors.email && (
          <p className="Auth_error">⚠️ A valid email address is required</p>
        )}
        <input
          {...register("password", {
            required: true,
          })}
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <p className="Auth_error">⚠️ A password is required</p>
        )}
        <button type="submit">Sign In</button>
      </form>
      <p className="Auth_signin Auth_signin__text">Don't have an account?</p>
      <button
        className="Auth_signin Auth_signin__link"
        onClick={handleSigninClick}
      >
        Sign up
      </button>
    </motion.div>
  );
};

export default Login;
