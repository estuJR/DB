import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4875'
})

export default api