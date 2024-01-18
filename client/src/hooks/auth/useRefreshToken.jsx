import axios from "@/api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      //   console.log(JSON.stringify(prev));
      //   console.log(response.data);
      return {
        ...prev,
        _id: response.data._id,
        username: response.data.username,
        role: response.data.role,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
