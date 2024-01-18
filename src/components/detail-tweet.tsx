import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { deleteObject, ref } from "firebase/storage";

function DetailTweet() {
  const [tweet, setTweet] = useState<ITweet[]>([]);
  const params = useParams();
  const tweetId = params.tweetId?.replace(":", "");
  const navigate = useNavigate();

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
  const user = auth.currentUser;
  return (
    <>
      <Link to="/">
        <svg
          className="ml-3 mt-3"
          xmlns="http://www.w3.org/2000/svg"
          height="30"
          width="30"
          viewBox="0 0 448 512"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
        </svg>
      </Link>
      <div className="mt-5">
        {tweet.map((item) => {
          if (item.id === tweetId) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-center flex-col gap-5"
              >
                <img src={item.image} className="rounded-full" />
                <div className="text-xl font-bold">{item.username}</div>
                <div className="text-xl font-bold w-[50vw] break-words text-center">
                  {item.tweet}
                </div>
                <button
                  className="bg-[#00CA5B] p-2 rounded-2xl text-white"
                  onClick={async () => {
                    if (item.userId !== user?.uid) {
                      toast.warning("본인 게시글만 삭제 가능합니다");
                    } else {
                      try {
                        await deleteDoc(doc(db, "tweet", item.id));
                        if (item.image) {
                          const imageRef = ref(
                            storage,
                            `tweet/${user.uid}-${user.displayName}/${item.id}`
                          );
                          await deleteObject(imageRef);
                        }
                        toast.info("삭제 완료");
                        navigate("/");
                      } catch (e) {
                        if (e instanceof FirebaseError) {
                          toast.error(e.message);
                        }
                      }
                    }
                  }}
                >
                  {item.userId === user?.uid
                    ? "삭제하기"
                    : "본인 게시글만 삭제 가능"}
                </button>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}

export default DetailTweet;
