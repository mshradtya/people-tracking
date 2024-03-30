import axios from "../../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios.post("/auth/logout", null, {
        withCredentials: true,
      });
      console.log(JSON.stringify(response.data.message));
    } catch (err) {
      console.log(err.message);
    }
  };

  return logout;
};

export default useLogout;
