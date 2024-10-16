import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/register`,
      formData
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};
