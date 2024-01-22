import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";

function Profile() {
  const user = auth.currentUser;
  const [avartar, setAvatar] = useState(user?.photoURL || "");
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      // avatars라는 폴더에 유저ID로 사진을 업로드
      // 유저 이미지를 저장할 수 있는 ref 생성
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      // 이미지 업로드
      const result = await uploadBytes(locationRef, file);
      // 이미지의 URL을 얻고
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      // 유저 프로필을 업데이트
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweet"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    try {
      const snapshot = await getDocs(tweetQuery);
      const tweet = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, image } = doc.data();
        return {
          tweet,
          createdAt,
          userId,
          username,
          image,
          id: doc.id,
        };
      });
      setTweets(tweet);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        {avartar ? (
          <img
            src={avartar}
            className="rounded-full object-fill w-[180px] h-[180px]"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
          </svg>
        )}
        <label
          htmlFor="profile"
          className="mt-5 bg-green-500 rounded-2xl p-2 text-white font-bold"
        >
          프로필 이미지 수정
        </label>
        <input
          type="file"
          id="profile"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
        />
        <span className="mt-2 rounded-2xl p-2 font-bold text-2xl">
          {user?.displayName ? user.displayName : "이름 없음"}
        </span>
      </div>
      <div className="w-[100%] flex flex-col gap-[10px] items-center justify-center mt-10">
        {tweets.map((tweet) => (
          <div className="w-[70%] flex items-center justify-evenly bg-slate-200 border rounded-xl">
            <img
              className="w-[100px] h-[100px] rounded-full object-fill"
              src={tweet.image}
            />
            <div className="text-lg font-semibold">{tweet.username}</div>
            <div className="text-lg font-semibold">{tweet.tweet}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Profile;
