import axios from 'axios';

const API = axios.create({
 baseURL: 'https://health-tech-platform.onrender.com/api', 
});

export default API;