import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { UserDispatchContext } from "../contexts/UserContext";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const userData = { email: email, password: password, username: username };

  const dispatch = useContext(UserDispatchContext);

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }
  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://conduit.productionready.io/api/users",
        {
          user: userData,
        }
      );

      setErrors({});

      // setUser({ ...userData });

      dispatch({
        type: "login",
        user: {
          bio: res.data.user.bio,
          email: res.data.user.email,
          image: res.data.user.image,
          username: res.data.user.username,
        },
      });
      localStorage.setItem("token", res.data.user.token);
      navigate("/");
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  }
  return (
    <div id="sign-up">
      <Navbar />
      <div className="container text-center mt-4 mx-auto px-4">
        <h1 className="font-[480] text-[2.5rem] leading-[1.2]">Sign Up</h1>
        <p className="pt-1 mb-4 text-[#5cb85c] hover:underline">
          <Link to="/sign-in">Have an account?</Link>
        </p>
        <form className="w-2/4 m-auto" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              className="input form-control"
              onChange={handleUsernameChange}
            />
            {errors.username ? (
              <p className="text-[#b85c5c] font-bold pb-3">
                Username {errors.username}
              </p>
            ) : null}
          </fieldset>
          <fieldset className="fieldset ">
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="input form-control"
              onChange={handleEmailChange}
            />
            {errors.email ? (
              <span className="text-[#b85c5c] font-bold pb-3">
                email {errors.email}
              </span>
            ) : null}
          </fieldset>
          <fieldset className="fieldset">
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="input form-control"
              onChange={handlePasswordChange}
            />
            {errors.password ? (
              <span className="text-[#b85c5c] font-bold pb-3">
                password {errors.password}
              </span>
            ) : null}
          </fieldset>
          <button
            type="submit"
            className="submit float-right py-3 px-6 text-xl"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
