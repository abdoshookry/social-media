import { faGear, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { UserContext, UserDispatchContext } from "../contexts/UserContext";

export default function Navbar() {
  const user = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    dispatch({ type: "logout" });
    navigate("/");
  }
  return (
    <div className="navbar">
      <div className="container m-auto ml-10   w-11/12">
        <nav className=" flex flex-wrap justify-between items-center  mx-auto  py-3  pb-5 ">
          <div className="text-[#5cb85c] text-2xl font-bold ">
            <Link to={"/"}>conduit</Link>
          </div>
          <ul className="flex gap-4 text-black/[.3]">
            <li>
              <Link to={"/"} className="hover:text-black hover:text-opacity-60">
                Home
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link
                    to={"/sign-in"}
                    className="hover:text-black hover:text-opacity-60"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/sign-up"}
                    className="hover:text-black hover:text-opacity-60"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to={"/editor"}
                    className=" hover:text-black hover:text-opacity-60"
                  >
                    <FontAwesomeIcon icon={faPen} />
                    New Post
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/settings"}
                    className="hover:text-black hover:text-opacity-60"
                  >
                    <FontAwesomeIcon icon={faGear} />
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/users/" + user.username}
                    className="hover:text-black hover:text-opacity-60"
                  >
                    {user.username}
                  </Link>
                </li>
                <li>
                  <button
                    className="hover:text-black hover:text-opacity-60"
                    onClick={handleLogout}
                  >
                    logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
