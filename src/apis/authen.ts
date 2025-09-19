import { apiEndPoint, ApiResponse } from '@/const/api'
import AxiosRefresh  from '@/utils/axios/axiosAuth'
import { getRefreshToken, setAccessToken } from '@/utils/token'
import axios, { AxiosResponse } from 'axios'

export const AuthenApi = {
   login: async (
      email: string,
      password: string
   ): Promise<AxiosResponse<ApiResponse>> => {
      const body = {
         email,
         password,
      }

      try {
         const response = await axios.post(
            `${apiEndPoint}/auth/login`,
            body
         )
         return response
      } catch (error: any) {
         throw error
      }
   },

   validate: async (): Promise<AxiosResponse<ApiResponse>> => {
      try {
         const response = await AxiosRefresh.get(`/auth/validate`)
         return response
      } catch (error: any) {
         throw error
      }
   },

   getRefreshToken: async (): Promise<any> => {
      const refreshToken = await getRefreshToken()
      const config = {
         headers: { Authorization: `Bearer ${refreshToken}` },
      }
      try {
         const response = await axios.get(
            `${apiEndPoint}/auth/refresh`,
            config
         )
         const accessToken = response.data.accessToken
         await setAccessToken(accessToken)
         return accessToken
      } catch (error: any) {
         throw error
      }
   },
}
