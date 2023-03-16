import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { format } from "date-fns";

import Navbar from "../components/Navbar";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

async function fetchArticle(slug) {
  const { data } = await axios.get(
    `https://conduit.productionready.io/api/articles/${slug}`
  );
  return data;
}

async function fetchComments(slug) {
  const { data } = await axios.get(
    `https://conduit.productionready.io/api/articles/${slug}/comments`,
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  );

  return data;
}

async function postComment({ slug, comment }) {
  const { data } = await axios.post(
    `https://conduit.productionready.io/api/articles/${slug}/comments`,
    { comment: { body: comment } },
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  );
  return data;
}

async function DeleteComment({ slug, id }) {
  const { data } = await axios.delete(
    `https://conduit.productionready.io/api/articles/${slug}/comments/${id}`,
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  );
  return data;
}
async function DeleteArticle({ slug }) {
  const { data } = await axios.delete(
    `https://conduit.productionready.io/api/articles/${slug}`,
    {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }
  );
  return data;
}

export default function ArticlePage() {
  const [comment, setComment] = useState("");

  const user = useContext(UserContext);

  const param = useParams();
  const slug = param.slug;

  const { data: articleData, status: articleStatus } = useQuery(
    ["article", slug],
    () => fetchArticle(slug),
    {
      staleTime: 3 * (60 * 1000),
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: commentsData,
    status: commentsStatus,
    refetch: refetchComments,
  } = useQuery(["comments", slug], () => fetchComments(slug), {
    staleTime: 3 * (60 * 1000),
    refetchOnWindowFocus: false,
  });

  if (articleStatus === "loading") {
    return <div>loading the article...</div>;
  }

  const postDate = format(
    new Date(articleData.article.createdAt),
    "MM/dd/yyyy"
  );
  let articleBody = articleData.article.body;
  articleBody = articleBody.split("\\n").map((str, i) => <p key={i}>{str}</p>);

  function handleComment(e) {
    setComment(e.target.value);
  }
  function reset() {
    setComment("");
  }
  async function handleCommentSubmission(e) {
    e.preventDefault();
    try {
      await postComment({ slug, comment });
      reset();
      refetchComments();
    } catch (error) {}
  }

  function handleDeleteComment(id) {
    DeleteComment({ slug, id });
    refetchComments();
  }

  function handleDeleteArticle() {
    DeleteArticle({ slug });
  }

  return (
    <div className="article">
      <Navbar />
      <div className="bg-[#333]">
        <div className="container py-12 text-white ">
          <div className="article-meta">
            <h1 className="pb-4 text-[2.5rem] font-medium leading-tight">
              {articleData.article.title}
            </h1>
            <div className="user-info flex items-center">
              <Link
                to={"/users/" + articleData.article.author.username}
                className="img"
              >
                <img
                  src={articleData.article.author.image}
                  alt=""
                  className="rounded-full h-8 "
                />
              </Link>
              <div className="info  ">
                <Link
                  to={"/users/" + articleData.article.author.username}
                  className="hover:underline"
                >
                  {articleData.article.author.username}
                </Link>

                <p className="date font-light text-base text-[#999] ">
                  {postDate}
                </p>
              </div>
            </div>
            {user && user.username === articleData.article.author.username ? (
              <div className="buttons my-1">
                <Link to={`/editor/${slug}`}>
                  <button className="border border-[#ccc] rounded text-[#ccc] py-1 px-2 mr-2  transition-colors hover:text-white hover:bg-[#ccc] ">
                    <FontAwesomeIcon icon={faPen} /> Edit Article
                  </button>
                </Link>
                <button
                  className="border border-[#b85c5c] rounded text-[#b85c5c] py-1 px-2 mr-2 transition-colors hover:text-white hover:bg-[#b85c5c]"
                  onClick={handleDeleteArticle}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete Article
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="body pt-4">
          <div className="text-xl  leading-7 mb-8">{articleBody}</div>
          <hr />

          {user ? (
            <div className="md:w-2/4 m-auto overflow-hidden">
              <form onSubmit={handleCommentSubmission}>
                <fieldset>
                  <textarea
                    name="comment"
                    placeholder="Write a comment...."
                    value={comment}
                    rows="3"
                    className="form-control border border-solid border-[#ced4da] rounded text-[#495057] p-5 w-full"
                    onChange={handleComment}
                  ></textarea>
                </fieldset>
                <button type="submit" className="submit float-right  py-1 px-3">
                  Post Comment
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center p-4">
              <Link to="/sign-in " className="text-[#5cb85c]">
                {" "}
                Sign in
              </Link>{" "}
              or{" "}
              <Link to="/sign-up" className="text-[#5cb85c]">
                {" "}
                sign up{" "}
              </Link>
              to add comments on this article
            </div>
          )}

          <div className="comments container w-3/5 p-4  m-auto">
            {commentsStatus === "loading" ? (
              <div>loading the comments...</div>
            ) : commentsStatus === "error" ? (
              <div>An error occured cannot load the comments</div>
            ) : (
              commentsData.comments.map((comment) => {
                const commentDate = format(
                  new Date(comment.createdAt),
                  "MM/dd/yyyy"
                );
                return (
                  <div
                    className="comment border flex-wrap break-all  p-4 mb-4"
                    key={comment.id}
                  >
                    <div className="comment-body pb-4">{comment.body}</div>
                    <hr />
                    <div className="comment-meta flex flex-wrap justify-between  p-4">
                      <div className="flex">
                        <Link
                          to={"/users/" + comment.author.username}
                          className="img mr-1 "
                        >
                          <img
                            src={comment.author.image}
                            alt=""
                            className="rounded-full h-5"
                          />
                        </Link>
                        <Link
                          to={"/users/" + comment.author.username}
                          className="text-[#5cb85c] hover:underline  mr-1"
                        >
                          {comment.author.username}
                        </Link>
                        <span>{commentDate}</span>
                      </div>

                      <div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
