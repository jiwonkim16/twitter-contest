import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export interface ITweet {
  id: string;
  image: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

function TimeLine() {
  const navigate = useNavigate();
  const [tweet, setTweet] = useState<ITweet[]>([]);
  const fetchTweet = async () => {
    const tweetQuery = query(
      collection(db, "tweet"),
      orderBy("createdAt", "desc")
    );
    const snapShot = await getDocs(tweetQuery);
    const tweets = snapShot.docs.map((doc) => {
      const { tweet, userId, username, image, createdAt } = doc.data();
      return {
        tweet,
        userId,
        username,
        image,
        createdAt,
        id: doc.id,
      };
    });
    setTweet(tweets);
  };
  useEffect(() => {
    fetchTweet();
  }, []);
  console.log(tweet);
  return (
    <div className="flex justify-center items-center gap-5 flex-col">
      {tweet.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            navigate(`/detail/:${item.id}`);
          }}
          className="flex items-center w-[80vw] p-4 h-[150px] border rounded-2xl gap-7"
        >
          <img
            src={item.image}
            className="w-[15%] h-[80%] rounded-full object-fill"
          />
          <div className="text-2xl font-bold w-[25%]">{item.username}</div>
          <div className="text-xl font-bold w-[60%] overflow-hidden">
            {item.tweet}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TimeLine;
