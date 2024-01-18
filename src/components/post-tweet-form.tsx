import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

function PostTweetForm() {
  const [tweet, setTweet] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTweet(event.target.value);
  };
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const img = event.target.files;
    if (img?.length === 1) {
      setImage(img[0]);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      await addDoc(collection(db, "tweet"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "이름 없음",
        userId: user.uid,
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(e.message);
      }
    } finally {
      setIsLoading(false);
      toast("등록 완료!");
      navigate("/");
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={tweet}
          maxLength={180}
          placeholder="게시글 작성"
          required
          onChange={onChange}
        />
        <input type="file" accept="image/*" onChange={onImageChange} />
        <button>{isLoading ? "등록 중..." : "등록하기"}</button>
      </form>
    </div>
  );
}

export default PostTweetForm;
