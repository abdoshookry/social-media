import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../contexts/UserContext";

async function updateSettings(user) {
  const res = axios.put(
    "https://conduit.productionready.io/api/user",
    { user: { ...user } },
    {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    }
  );

  return res;
}
export default function Settings() {
  const user = useContext(UserContext);
  const [changedUser, setChangedUser] = useState({});
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    setChangedUser({ ...user });
  }, [user]);

  function handleImageChange(e) {
    setChangedUser({ ...changedUser, image: e.target.value });
  }
  function handleUsernameChange(e) {
    setChangedUser({ ...changedUser, username: e.target.value });
  }
  function handleBioChange(e) {
    setChangedUser({ ...changedUser, bio: e.target.value });
  }
  function handleEmailChange(e) {
    setChangedUser({ ...changedUser, email: e.target.value });
  }
  function handlePasswordChange(e) {
    setChangedUser({ ...changedUser, password: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateSettings(changedUser);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <div className="Settings">
      <Navbar />
      <div className="container flex flex-col items-center">
        <h1>Your Settings</h1>
        <form action="" className="w-3/4 mx-auto" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <input
              type="url"
              name="url"
              value={changedUser ? changedUser.image : ""}
              placeholder="URL of profile picture"
              className="input form-control"
              onChange={handleImageChange}
            />
          </fieldset>
          <fieldset className="fieldset">
            <input
              type="text"
              name="username"
              value={changedUser ? changedUser.username : ""}
              placeholder="New Username"
              className="input form-control"
              onChange={handleUsernameChange}
            />
          </fieldset>
          <fieldset className="fieldset">
            <textarea
              name="bio"
              value={changedUser ? changedUser.bio : ""}
              placeholder="Short bio about you"
              rows="8"
              className="form-control border border-solid border-[#ced4da] rounded text-[#495057] p-5 w-full"
              onChange={handleBioChange}
            ></textarea>
          </fieldset>
          <fieldset className="fieldset">
            <input
              type="email"
              name="email"
              value={changedUser ? changedUser.email : ""}
              placeholder="New Email"
              className="input form-control"
              onChange={handleEmailChange}
            />
          </fieldset>
          <fieldset className="fieldset">
            <input
              type="password"
              name="password"
              value={
                changedUser
                  ? changedUser.password
                    ? changedUser.password
                    : ""
                  : ""
              }
              placeholder="New password"
              className="input form-control"
              onChange={handlePasswordChange}
            />
          </fieldset>
          <button
            type="submit"
            className="submit float-right py-3 px-6 text-xl"
          >
            Update Settings
          </button>
        </form>
        <div className="text-3xl p-4">
          {status === "error" ? (
            <span className=" text-[#b85c5c]">Invalid Username or Email</span>
          ) : status === "success" ? (
            <span className="text-green-600">Updated Successfully</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
