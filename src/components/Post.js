import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useContext } from "react";
import axios from "axios";

import { UserContext } from "../contexts/UserContext";

async function postFavourite({ slug }) {
  const res = await axios.post(
    ` https://conduit.productionready.io/api/articles/${slug}/favorite`,
    {},
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  );
  return res;
}
async function deleteFavourite({ slug }) {
  const res = await axios.delete(
    ` https://conduit.productionready.io/api/articles/${slug}/favorite`,
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  );
  return res;
}

export default function Post({
  userImage,
  userName,
  postTitle,
  postDesc,
  postDate,
  postLike,
  slug,
  favorited,
}) {
  const [favorite, setFavourite] = useState(favorited);

  const [likes, setLikes] = useState(postLike);
  const user = useContext(UserContext);
  function handlePostLike() {
    if (user) {
      if (!favorite) {
        postFavourite({ slug });
        setLikes((n) => n + 1);
      } else {
        deleteFavourite({ slug });
        setLikes((n) => n - 1);
      }
      setFavourite(!favorite);
    }
  }
  return (
    <div className="post pb-3">
      <div className="post-meta flex items-center  pb-3">
        <Link to={"/users/" + userName} className="img">
          <img src={userImage} alt="" className="rounded-full " />
        </Link>
        <div className="info ">
          <Link
            to={"/users/" + userName}
            className="text-[#5cb85c] hover:underline"
          >
            {userName}
          </Link>

          <p className="date font-light text-base text-[#999] ">{postDate}</p>
        </div>
        <div className="button ml-auto ">
          <button
            className={
              "py-1 px-2 text-[#5cb85c] border border-solid rounded border-[#5cb85c]  hover:bg-[#398439] hover:text-white  hover:border-[#2d672d]  ease-in-out duration-150 " +
              (favorite ? "bg-[#398439] text-white border-[#2d672d]" : "")
            }
            onClick={handlePostLike}
          >
            <FontAwesomeIcon icon={faHeart} className="mr-1" />
            {likes}
          </button>
        </div>
      </div>
      <div className="post-body">
        <Link to={"/article/" + slug}>
          <h1 className="pb-1 text-2xl">{postTitle}</h1>
          <p className="font-light text-base text-[#999] mb-4">{postDesc}</p>
          <span className="font-light text-xs text-[#bbb]">Read more...</span>
        </Link>
      </div>
    </div>
  );
}
