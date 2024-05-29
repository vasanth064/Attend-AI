import { selectCurrentUser } from "@/redux/authentication/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.user?.userType === "ADMIN") navigate("/admin");
  }, []);
  return (
    <div>
      <h1>Hello {user?.name}</h1>
    </div>
  );
};

export default Home;
