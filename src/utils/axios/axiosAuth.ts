import axios from 'axios'
import { apiEndPoint } from '@/const/api'
import { getAccessToken } from '@/utils/token'
import { AuthenApi } from '@/apis/authen'

const AxiosAuth = axios.create({
   baseURL: apiEndPoint,
})

AxiosAuth.interceptors.request.use(
   async (config) => {
      const accessToken = await getAccessToken()

      if (accessToken) {
         if (config.headers)
            config.headers['Authorization'] = `Bearer ${accessToken}`
      }

      return config
   },
   (error) => {
      return Promise.reject(error)
   }
)

AxiosAuth.interceptors.response.use(
   async (response) => response,
   async (error) => {
      const errorResponse = error?.response
      const accessToken = await getAccessToken()
      if ((errorResponse.status === 401 || errorResponse.status === 403) && !!accessToken ) {
         try {
            const newAccessToken = await AuthenApi.getRefreshToken()
            errorResponse.config.headers.Authorization = `Bearer ${newAccessToken}`
            errorResponse.config.__isRetryRequest = true
            return await axios(errorResponse.config)
         } catch (error) {
            return Promise.reject(error)
         }
      }
      return Promise.reject(error)
   }
)

export default AxiosAuth
