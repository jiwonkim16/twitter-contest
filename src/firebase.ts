import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAzbZyj1FDyJHuJtPFNA3I7rO_2IyIlmBk",
  authDomain: "twitter-contest.firebaseapp.com",
  projectId: "twitter-contest",
  storageBucket: "twitter-contest.appspot.com",
  messagingSenderId: "950554793864",
  appId: "1:950554793864:web:643924b518d3012ed88c3d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
