import axios from "axios";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useQuery } from "react-query";
import { format, set } from "date-fns";

import Post from "./Post";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";

async function fetchPosts(props) {
  let url;
  if (props.favourites) {
    url = `https://conduit.productionready.io/api/articles?favorited=${props.username}`;
  } else if (props.username)
    url = `https://conduit.productionready.io/api/articles?author=${props.username}`;
  else url = `https://conduit.productionready.io/api/articles`;

  const { data } = await axios.get(url);
  return data;
}

async function fetchFavorites(props, user) {
  let url;
  if (props.username) {
    url = `https://conduit.productionready.io/api/articles?favorited=${props.username}`;
  } else if (user) {
    url = `https://conduit.productionready.io/api/articles?favorited=${user.username}`;
  } else {
    return;
  }

  const { data } = await axios.get(url, {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` },
  });
  return data;
}

export default function Feed(props) {
  const user = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  const { data: postsData, status: postsStatus } = useQuery(
    ["posts", props],
    () => fetchPosts(props),
    {
      staleTime: 3 * (60 * 1000),
      refetchOnWindowFocus: false,
    }
  );
  const { data: FavoritesData } = useQuery(
    ["favorites", props, user],
    () => fetchFavorites(props, user),
    {
      staleTime: 3 * (60 * 1000),
      refetchOnWindowFocus: false,
    }
  );
  function handleShowPopup(e) {
    e.stopPropagation();
    setShowPopup(!showPopup);
  }
  const posts =
    postsData &&
    postsData.articles.map((post) => {
      const favorited = FavoritesData?.articles.find(
        (article) => post.slug === article.slug
      );
      return (
        <div className="post-wraper" key={uuid()}>
          <Post
            userName={post.author.username}
            userImage={post.author.image}
            postTitle={post.title}
            postDesc={post.description}
            postDate={format(new Date(post.createdAt), "MM/dd/yyyy")}
            postLike={post.favoritesCount}
            slug={post.slug}
            favorited={favorited ? true : false}
            onShowPopup={setShowPopup}
          />
          <hr />
        </div>
      );
    });

  return (
    <div className="feed">
      <div
        className={
          "overlay w-full h-full top-0 left-0 bg-[#ddd]/[.5]  fixed  overflow-hidden" +
          (showPopup ? " block" : " hidden ")
        }
        onClick={handleShowPopup}
      >
        {" "}
        {showPopup ? (
          <div
            className="popup relative left-2/4 -translate-x-2/4 top-2/4 -translate-y-2/4 xl:w-1/4 lg:w-2/4 h-2/4 rounded-xl bg-white flex flex-col items-center text-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute top-0 left-0 py-2 px-4 cursor-pointer"
              onClick={handleShowPopup}
            >
              X
            </span>{" "}
            <h2 className="mb-2">Login to like the posts</h2>{" "}
            <ul className="w-full ">
              <li className=" mb-2">
                <Link
                  to={"/sign-in"}
                  className="transition-all ease-in hover:mr-3 focus:text-green-400"
                >
                  <button className="button w-2/4 py-2">Sign In</button>
                </Link>
              </li>
              <li className="">
                <Link
                  to={"/sign-up"}
                  className="transition-all ease-in hover:mr-3 focus:text-green-400"
                >
                  <button className="button w-2/4 py-2">Sign Up</button>
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="container float-left pt-4 md:mx-10  md:w-3/4 ">
        <nav className="">
          <ul>
            <li>
              {props.username ? (
                <>
                  <Link
                    to={"/users/" + props.username}
                    className={props.favourites ? "not-active" : "active"}
                  >
                    My Articles
                  </Link>
                  <Link
                    to={"/users/" + props.username + "/favorites"}
                    className={props.favourites ? "active" : "not-active"}
                  >
                    Favorited Articles
                  </Link>
                </>
              ) : (
                <>
                  <Link to={"/"} className="active">
                    Global Feed
                  </Link>
                </>
              )}
            </li>
          </ul>
        </nav>
        <hr />
        {postsStatus === "loading" && <span>Loading...</span>}
        {postsStatus === "error" && <span>an Error occured</span>}
        {posts}
      </div>
    </div>
  );
}
