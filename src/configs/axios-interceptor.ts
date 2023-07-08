import axios from 'axios'

// Add a request interceptor
axios.interceptors.request.use(
  function (config: any) {
    config.baseURL = process.env.NEXT_PUBLIC_APP_BASE_URL
    const token = localStorage.getItem('accessToken')
    config.headers.Authorization = token ? `Bearer ${token}` : ''

    return config
  },
  function (error) {
    console.log(error)

    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  response => {
    // Do something with response data
    return response
  },
  error => {
    console.log(error)

    // localStorage.clear();
    // window.location.href = "/login";
    return Promise.reject(error)
  }
)

export default axios
