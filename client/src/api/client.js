import env from "../utils/env.js";
import axios from "axios";

const client = axios.create({ baseURL: env.server.url });

export default client;