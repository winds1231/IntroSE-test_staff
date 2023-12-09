import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";
const handleLoginAPI = async (id, password) => {
  return axios.post("/api/login", { id, password });
};

export { handleLoginAPI };
