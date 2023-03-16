import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function HomePage() {
  const user = useContext(UserContext);
  return (
    <div className="home">
      <Navbar />
      {!user ? (
        <div className="header container mx-auto max-w-full bg-[#5cb85c] text-white flex justify-center items-center py-4 px-4 mb-4">
          <header className=" ">
            <h1 className="text-[3.5rem] text-center pb-2 pt-4 mb-2">
              conduit
            </h1>
            <p className="text-[1.3rem] font-thin pb-[18px]">
              A place to share your knowledge.
            </p>
          </header>
        </div>
      ) : null}
      <Feed />
    </div>
  );
}
