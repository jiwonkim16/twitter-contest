import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ChangeEvent, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

function CreateAccount() {
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "email") {
      setEmail(value);
    } else if (name === "nickName") {
      setNickName(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || nickName === "" || email === "" || password === "") {
      toast.error("올바른 형식이 아닙니다.");
    }
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, { displayName: nickName });
      toast.success("계정 생성");
      navigate("/login");
    } catch (e) {
      if (e instanceof FirebaseError) toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center justify-center h-[50vh] gap-7"
      >
        <input
          required
          type="email"
          value={email}
          name="email"
          placeholder="이메일을 입력하세요"
          onChange={onChange}
          className="border text-center p-1"
        />
        <input
          required
          type="text"
          name="nickName"
          value={nickName}
          placeholder="닉네임을 입력하세요"
          onChange={onChange}
          className="border text-center p-1"
        />
        <input
          required
          type="password"
          name="password"
          value={password}
          placeholder="비밀번호를 입력하세요"
          onChange={onChange}
          className="border text-center p-1"
        />
        <button className="bg-[#0BA5E9] rounded-xl text-white w-[180px] p-2">
          {isLoading ? "계정 생성 중" : "계정 생성"}
        </button>
      </form>
    </>
  );
}

export default CreateAccount;
