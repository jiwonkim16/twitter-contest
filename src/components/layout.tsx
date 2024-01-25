import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { toast } from "react-toastify";

function Layout() {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const handleLogout = async () => {
    if (currentUser !== null) {
      await auth.signOut();
      toast.warning("로그아웃 성공");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <div className="flex items-center justify-between ">
        <Link to="/">
          <img
            src="../public/twitter-contest-logo.png"
            className="w-[150px] h-[150px] rounded-xl"
          />
        </Link>
        <div className="flex gap-4 mr-4">
          <button className="text-xl font-bold">
            <Link to="/">홈</Link>
          </button>
          <button className="text-xl font-bold">
            <Link to="/post-tweet">트윗 작성</Link>
          </button>
          <button className="text-xl font-bold">
            <Link to="profile">프로필</Link>
          </button>
          <button className="text-xl font-bold" onClick={handleLogout}>
            {currentUser ? "로그아웃" : "로그인"}
          </button>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Layout;
