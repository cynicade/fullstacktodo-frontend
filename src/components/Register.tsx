import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import "./styles/Auth.scss";
import { useNavigate } from "react-router-dom";

interface IFormInputs {
  email: string;
  username: string;
  password: string;
}

interface IProps {
  handleSigninClick: () => void;
  handleAuthChange: () => void;
}

const Register = ({
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
    const res = await fetch("http://cynicade.xyz/todo/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: user.email,
        username: user.username,
        password: user.password,
      }),
    });

    const data = await res.json();

    if (data.message === "user registered successfully") {
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
        <h1>Sign up</h1>
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
          {...register("username", {
            required: true,
            maxLength: 40,
          })}
          placeholder="Username"
        />
        {errors.username && (
          <p className="Auth_error">⚠️ A username is required (max lengh 40)</p>
        )}
        <input
          {...register("password", {
            required: true,
            maxLength: 40,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
          })}
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <p className="Auth_error">
            ⚠️ A sufficiently strong password is required
            <br />
            (min. 8 characters, one uppercase letter and one number)
          </p>
        )}
        <button type="submit">Sign Up</button>
      </form>
      <p className="Auth_signin Auth_signin__text">Already have an account?</p>
      <button
        className="Auth_signin Auth_signin__link"
        onClick={handleSigninClick}
      >
        Sign in
      </button>
    </motion.div>
  );
};

export default Register;
