import axios from "axios";
import config from "../config/config";

const instance = axios.create({
	baseURL: config.API_URL,
	// withCredentials: true
});

export default instance;

