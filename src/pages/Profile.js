import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { useMatch, useParams } from "react-router-dom";
import Feed from "../components/Feed";
import Navbar from "../components/Navbar";
import { UserContext } from "../contexts/UserContext";

async function fetchProfile(username) {
  const res = axios.get(
    `https://conduit.productionready.io/api/profiles/${username}`,
    {
      username: username,
    }
  );

  return res;
}
export default function Profile() {
  const user = useContext(UserContext);
  const param = useParams();
  const { data, status } = useQuery(
    ["profiles", param.username],
    () => fetchProfile(param.username),
    {
      staleTime: 3 * (60 * 1000),
      refetchOnWindowFocus: false,
    }
  );
  const match = useMatch("/users/:username/favorites");
  return (
    <div className="profile">
      <Navbar />
      {status === "success" ? (
        <>
          <div className="profile-details container mx-auto max-w-full bg-[#f3f3f3] flex flex-col justify-center items-center py-4 pt-8 px-4 mb-4">
            <img
              className="h-14 rounded-full"
              src={data.data.profile.image}
              alt=""
            />
            <h2 className="py-3">{data.data.profile.username}</h2>
            {user && user.username !== data.data.profile.username ? (
              <button className="p-1 float-right ml-auto border border-[#999] rounded text-[#999] text-sm">
                + Follow {data.data.profile.username}
              </button>
            ) : null}
          </div>

          <Feed username={data.data.profile.username} favourites={match} />
        </>
      ) : status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <p>Error...</p>
      )}
    </div>
  );
}
