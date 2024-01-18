import {
  Unsubscribe,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ITweet } from "./timeline";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetailTweet() {
  const [tweet, setTweet] = useState<ITweet[]>([]);
  const params = useParams();
  const tweetId = params.tweetId?.replace(":", "");

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweet = async () => {
      const tweetQuery = query(
        collection(db, "tweet"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, image } = doc.data();
          return { tweet, createdAt, userId, username, image, id: doc.id };
        });
        setTweet(tweets);
      });
    };
    fetchTweet();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <>
      {tweet.map((item) => {
        if (item.id === tweetId) {
          return (
            <div key={item.id}>
              <img src={item.image} />
              <div>{item.username}</div>
              <div>{item.tweet}</div>
            </div>
          );
        }
      })}
    </>
  );
}

export default DetailTweet;
