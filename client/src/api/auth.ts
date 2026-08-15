import axiosClient from "../libs/axiosClient";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosClient.post("/api/users/login", { email, password });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axiosClient.post("/api/users/register", { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await axiosClient.get("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AuthUser = async (token: string) => {
  const data = await getUserProfile(token)
  return data.user
};
