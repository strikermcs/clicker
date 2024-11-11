import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { logout } = useAuthContext();
  const router = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router("/dashboardAdxadmin36024x");
  };

  return (
    <span onClick={handleLogout} className={`px-2 py-3 flex rounded-[6px] cursor-pointer items-center space-x-1 font-medium`}>
      {/* <IoIosLogOut size={16} className='' />  */}
      {isLoggingOut ? (<><span>Logging out...</span></>) : (<><span>Logout</span></>)}
    </span>
  );
}
