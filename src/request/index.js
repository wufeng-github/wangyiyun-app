import axios from 'axios';
let service = axios.create({
    baseURL: "http://localhost:3000/",
    // baseURL: "https://netease-cloud-music-30v6q1k0c-wufeng-github.vercel.app/",
    timeout: 3000
})

export default service