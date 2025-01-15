import React, { useEffect, useState } from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import useUserStore from "../../store/userStore";
import circlesBg from "../../assets/circlesBg.png";
import taskImg from "../../assets/task.png";
import googleIcon from "../../assets/googleIcon.png";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const { email, setEmail, setUserName,setUserProfilePic } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const userEmail = result?.user?.email ?? "";
      const userName = result?.user?.displayName ?? "";
      const userProfilePic = result?.user?.photoURL ?? "";
      setEmail(userEmail);
      setUserName(userName);
      setUserProfilePic(userProfilePic);

      localStorage.setItem("user", JSON.stringify(userEmail));
      localStorage.setItem("userName", JSON.stringify(userName));
      localStorage.setItem("userProfilePic", JSON.stringify(userProfilePic));
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("user");
    const storedUserName = localStorage.getItem("userName");
    const storedUserProfilePic = localStorage.getItem("userProfilePic");
    if (storedEmail && storedUserName && storedUserProfilePic) {
      setEmail(storedEmail);
      setUserName(storedUserName);
      setUserProfilePic(storedUserProfilePic);

    }
  }, [setEmail, setUserName, setUserProfilePic]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-lightPink py-6 pl-16">
      <div className="w-full lg:w-1/3">
        <div className="w-80 flex flex-col items-start">
          <div className="flex gap-2 items-center justify-center mb-2">
            <img src={taskImg} alt="task" className="w-8 h-8" />
            <h1 className="text-3xl font-semibold text-[#7B1984]">TaskBuddy</h1>
          </div>
          <p className="text-start text-gray-950 font-medium text-sm mb-6">
            {"Streamline your workflow and manage tasks efficiently with an all-in-one tool."}
          </p>
        </div>

        {!email && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`flex items-center justify-center px-16 py-3 bg-[#292929] text-white font-medium text-sm rounded-2xl shadow transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}>
            {loading ? (
              "Signing In..."
            ) : (
              <>
                <img src={googleIcon} alt="googleIcon" className="mr-2" />
                <span className="text-lg"> Continue with Google</span>
              </>
            )}
          </button>
        )}
      </div>

      <div
        className="w-full lg:w-2/3 bg-contain bg-no-repeat	 bg-center min-h-[calc(100vh-100px)] "
        style={{ backgroundImage: `url(${circlesBg})` }}></div>
    </div>
  );
};

export default SignIn;
