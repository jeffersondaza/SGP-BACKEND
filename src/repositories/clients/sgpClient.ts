import axios from "axios";

const sgpClient = axios.create({
    // baseURL: process.env.SGPURL
});

export default sgpClient;

