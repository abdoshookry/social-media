import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

async function postArticle(article) {
  const res = axios.post(
    "https://conduit.productionready.io/api/articles",
    { article: { ...article } },
    {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    }
  );

  return res;
}
async function fetchArticle(slug) {
  if (!slug) return;
  const { data } = await axios.get(
    `https://conduit.productionready.io/api/articles/${slug}`
  );
  return data;
}

async function updateArticle({ slug, article }) {
  const res = await axios.put(
    `https://conduit.productionready.io/api/articles/${slug}`,
    { article: { ...article } },
    {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    }
  );
  return res;
}

export default function Editor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [article, setArticle] = useState({});
  const [errors, setErrors] = useState({});
  const param = useParams();
  const slug = param.slug;
  const { data: articleData } = useQuery(
    ["article", slug],
    () => fetchArticle(slug),
    {
      staleTime: 3 * (60 * 1000),
      refetchOnWindowFocus: false,
    }
  );
  const mutation = useMutation(updateArticle, {
    onMutate: async (newArticle) => {
      await queryClient.cancelQueries(["article", slug]);

      const previousArticle = queryClient.getQueryData(["article", slug]);

      return { previousArticle };
    },
    onError: (err, newArticle, context) => {
      console.log(err);
      setErrors(err.response.data.errors);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["article", slug], { ...data.data });

      navigate(`/article/${data.data.article.slug}`);
    },
  });

  useEffect(() => {
    if (articleData) {
      const temp = {
        title: articleData.article.title,
        description: articleData.article.description,
        body: articleData.article.body,
        tagList: articleData.article.tagList.join(" "),
      };
      setArticle({ ...temp });
    }
  }, [articleData, setArticle]);

  function handleTitleChange(e) {
    setArticle({ ...article, title: e.target.value });
  }
  function handleDescriptionChange(e) {
    setArticle({ ...article, description: e.target.value });
  }
  function handleBodyChange(e) {
    setArticle({ ...article, body: e.target.value });
  }
  function handleTagsChange(e) {
    setArticle({ ...article, tagList: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const tags = article.tagList.trim().split(" ");

      if (slug) {
        mutation.mutate({
          slug,
          article: { ...article, tagList: tags },
        });
        return;
      } else {
        const res = await postArticle({ ...article, tagList: tags });
        navigate(`/article/${res.data.article.slug}`);
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors);
    }
  }
  return (
    <div className="Settings">
      <Navbar />
      <div className="container flex flex-col items-center">
        <form action="" className="w-3/4 mx-auto" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <input
              required
              type="title"
              name="title"
              value={article ? article.title : ""}
              placeholder="Title"
              className="input form-control"
              onChange={handleTitleChange}
            />

            {errors.title ? (
              <div className="text-lg text-center p-1">
                <span className=" text-[#b85c5c]">
                  {"Title " + errors.title}
                </span>
              </div>
            ) : null}
          </fieldset>
          <fieldset className="fieldset">
            <input
              required
              type="text"
              name="description"
              value={article ? article.description : ""}
              placeholder="Description"
              className="input form-control"
              onChange={handleDescriptionChange}
            />
            {errors.description ? (
              <div className="text-lg text-center p-1">
                <span className=" text-[#b85c5c]">
                  {"Description " + errors.description}
                </span>
              </div>
            ) : null}
          </fieldset>
          <fieldset className="fieldset">
            <textarea
              required
              name="body"
              value={article ? article.body : ""}
              placeholder="Write your article"
              rows="8"
              className="form-control border border-solid border-[#ced4da] rounded text-[#495057] p-5 w-full"
              onChange={handleBodyChange}
            ></textarea>
            {errors.body ? (
              <div className="text-lg text-center p-1">
                {" "}
                <span className=" text-[#b85c5c]">{"Body " + errors.body}</span>
              </div>
            ) : null}
          </fieldset>
          <fieldset className="fieldset">
            <input
              type="text"
              name="tags"
              value={article ? article.tagList : ""}
              placeholder="Tags"
              className="input form-control"
              onChange={handleTagsChange}
            />
            {errors.tags ? (
              <div className="text-lg text-center p-1">
                <span className=" text-[#b85c5c]">{"tags " + errors.tags}</span>
              </div>
            ) : null}
          </fieldset>

          <button
            type="submit"
            className="submit float-right py-3 px-6 text-xl"
          >
            Publish Article
          </button>
        </form>
        {/* <div className="text-3xl p-4">
          {errors.title ? (
            <span className=" text-[#b85c5c]">{errors.title}</span>
          ) : null}
        </div> */}
      </div>
    </div>
  );
}
