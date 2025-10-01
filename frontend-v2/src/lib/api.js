import axios from 'axios'

const api = axios.create({ baseURL: 'https://food-view-fvig.onrender.com', withCredentials: true })

export default api


