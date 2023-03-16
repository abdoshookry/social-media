import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserDispatchContext } from "./contexts/UserContext";
import { useContext, useEffect } from "react";
import axios from "axios";

import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import ArticlePage from "./pages/Article";
import SignInPage from "./pages/SignIn";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Editor from "./pages/Editor";

function App() {
  const dispatch = useContext(UserDispatchContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.hasOwnProperty("token")) {
        const res = await axios("https://conduit.productionready.io/api/user", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });

        dispatch({
          type: "login",
          user: res.data.user,
        });
      }
    };
    fetchUser();
  }, [dispatch]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/Sign-up",
      element: <SignUpPage />,
    },
    {
      path: "/Sign-in",
      element: <SignInPage />,
    },
    {
      path: "/article/:slug",
      element: <ArticlePage />,
    },
    {
      path: "/users/:username",
      element: <Profile />,
    },
    {
      path: "/users/:username/favorites",
      element: <Profile />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/editor/:slug?",
      element: <Editor />,
    },
  ]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
