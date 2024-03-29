import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import LoadingScreen from "./components/loading-screen";
import ProtectedRoute from "./components/protected-route";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import PostTweetForm from "./components/post-tweet-form";
import DetailTweet from "./components/detail-tweet";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/post-tweet",
    element: <PostTweetForm />,
  },
  {
    path: "/detail/:tweetId",
    element: <DetailTweet />,
  },
]);
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>{isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}</>
  );
}

export default App;
