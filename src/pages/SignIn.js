import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { UserDispatchContext } from "../contexts/UserContext";
import { useContext, useState } from "react";

export default function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);

  const userData = { email: email, password: password };

  const dispatch = useContext(UserDispatchContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.clear();
    try {
      const res = await axios.post(
        "https://conduit.productionready.io/api/users/login",
        { user: userData }
      );
      setErrors(false);

      dispatch({
        type: "login",
        user: res.data.user,
      });

      localStorage.setItem("token", res.data.user.token);

      navigate("/");
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };
  return (
    <div id="sign-in">
      <Navbar />
      <div className="container text-center mt-4 mx-auto px-4">
        <h1 className="font-[480] text-[2.5rem] leading-[1.2]">Sign In</h1>
        <p className="pt-1 mb-4 text-[#5cb85c] hover:underline">
          <Link to="/sign-up">Need an account?</Link>
        </p>
        <form className="w-2/4 m-auto" onSubmit={handleSubmit}>
          <fieldset className="fieldset ">
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="input form-control"
              onChange={handleEmailChange}
            />
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
            {errors ? (
              <span className="text-[#b85c5c] font-bold pb-3">
                incorrect email or password
              </span>
            ) : null}
          </fieldset>
          <button
            type="submit"
            className="button float-right py-3 px-6 text-xl"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
