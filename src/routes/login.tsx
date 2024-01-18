import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;
    if (name === "id") {
      setId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || id === "" || password === "") {
      toast.error("올바른 형식이 아닙니다.");
    }
    try {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, id, password);
      toast.success("로그인 성공");
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("로그인 성공");
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(e.message);
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-[100vh] flex-col">
      <form onSubmit={onSubmit} className="flex flex-col gap-7">
        <input
          type="text"
          name="id"
          required
          onChange={onChange}
          placeholder="아이디를 입력하세요"
          className="border text-center p-1"
        />
        <input
          type="password"
          name="password"
          required
          onChange={onChange}
          placeholder="비밀번호를 입력하세요"
          className="border text-center p-1"
        />
        <button className="bg-[#00CA5B] text-white rounded-xl p-2">
          {isLoading ? "로그인 중" : "로그인"}
        </button>
        <button
          className="flex gap-1 items-center justify-center bg-[#FA905D] text-white rounded-xl p-2"
          onClick={handleGoogleLogin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="15.25"
            viewBox="0 0 488 512"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          구글 로그인
        </button>
        <button
          onClick={() => {
            navigate("/create-account");
          }}
          className="bg-[#80258F] text-white rounded-xl p-2"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Login;
