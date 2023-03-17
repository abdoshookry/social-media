import { faGear, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { UserContext, UserDispatchContext } from "../contexts/UserContext";

export default function Navbar() {
  const [showLinks, setShowLinks] = useState(false);
  const user = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    dispatch({ type: "logout" });
    navigate("/");
  }
  function handleBurgerMenu() {
    setShowLinks(!showLinks);
  }
  return (
    <div className="navbar">
      <div
        className={
          "overlay w-full h-full top-0 left-0 bg-[#ddd]/[.5]  fixed  " +
          (showLinks ? " block" : " hidden ")
        }
        onClick={handleBurgerMenu}
      ></div>
      <div className="container m-auto ml-10   w-11/12">
        <nav className=" flex flex-wrap justify-between items-center  mx-auto  py-3  pb-5 ">
          <div className="text-[#5cb85c] text-2xl font-bold ">
            <Link to={"/"}>conduit</Link>
          </div>
          <div className=" block  md:hidden">
            <div
              className="burger-menu absolute p-1 cursor-pointer z-10 "
              onClick={handleBurgerMenu}
            >
              <div
                className={
                  "h-1 w-6 mb-1 rounded bg-black transition-all ease-in-out " +
                  (showLinks
                    ? " origin-center rotate-45 -translate-x-1 translate-y-1 "
                    : "")
                }
              ></div>
              <div
                className={
                  "h-1 w-6 mb-1 rounded bg-black transition-all ease-in-out " +
                  (showLinks ? " hidden" : "")
                }
              ></div>
              <div
                className={
                  "h-1 w-6 mb-1 rounded bg-black transition-all ease-in-out " +
                  (showLinks
                    ? " origin-center -rotate-45 -translate-x-1 -translate-y-1 "
                    : "")
                }
              ></div>
            </div>
            <div
              className={
                "menu absolute bg-white shadow-slate-800 drop-shadow-2xl h-full w-1/4 flex-wrap break-all right-0 top-0 " +
                (showLinks ? "block " : "hidden")
              }
            >
              <ul className=" text-[#292929] relative flex flex-col gap-4 top-10 text-right p-7">
                <li className="border-b-2 border-[#ddd]">
                  <Link
                    to={"/"}
                    className="transition-all ease-in hover:mr-3 focus:text-green-400"
                  >
                    Home
                  </Link>
                </li>

                {!user ? (
                  <>
                    <li className="border-b-2 border-[#ddd]">
                      <Link
                        to={"/sign-in"}
                        className="transition-all ease-in hover:mr-3 focus:text-green-400"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li className="border-b-2 border-[#ddd]">
                      <Link
                        to={"/sign-up"}
                        className="transition-all ease-in hover:mr-3 focus:text-green-400"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="border-b-2 border-[#ddd]">
                      <Link
                        to={"/editor"}
                        className="transition-all ease-in hover:mr-3 focus:text-green-400"
                      >
                        <FontAwesomeIcon icon={faPen} />
                        New Post
                      </Link>
                    </li>
                    <li className="border-b-2 border-[#ddd]">
                      <Link
                        to={"/settings"}
                        className="transition-all ease-in hover:mr-3 focus:text-green-400"
                      >
                        <FontAwesomeIcon icon={faGear} />
                        Settings
                      </Link>
                    </li>
                    <li className="border-b-2 border-[#ddd]">
                      <Link
                        to={"/users/" + user.username}
                        className="transition-all ease-in hover:mr-3 focus:text-green-400"
                      >
                        {user.username}
                      </Link>
                    </li>
                    <li className="border-b-2 border-[#ddd]">
                      <button
                        className="transition-all ease-in hover:mr-3 focus:text-green-400"
                        onClick={handleLogout}
                      >
                        logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className=" hidden md:block">
            <ul className="flex gap-4 text-black/[.3]">
              <li>
                <Link
                  to={"/"}
                  className="hover:text-black hover:text-opacity-60"
                >
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
          </div>
        </nav>
      </div>
    </div>
  );
}
