import { Outlet } from "react-router-dom";
import { selectCurrentUser } from "@/redux/authentication/authSlice";
import { useSelector } from 'react-redux';
const UserPage = () => {

  const user = useSelector(selectCurrentUser);
  return (
    <>
      <div>Welcome: {user.user?.name}</div>
      <Outlet />
    </>
  )
}


export default UserPage;
