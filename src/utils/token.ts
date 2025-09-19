'use client'

import Cookies from 'js-cookie'

const accessToken = 'ticket-AccessToken'
const refreshToken = 'ticket-RefreshToken'

export async function getAccessToken(): Promise<string | undefined> {
   try {
      const token = await Cookies.get(accessToken)
      return token
   } catch (error) {
      throw {
         data: {
            messageTh: 'Get AccessToken error',
         },
      }
   }
}

export async function getRefreshToken(): Promise<string | undefined> {
   try {
      const token = await Cookies.get(refreshToken)
      return token
   } catch (error) {
      throw {
         data: {
            messageTh: 'Get RefreshToken error',
         },
      }
   }
}

export async function setAccessToken(token: string): Promise<boolean> {
   try {
      Cookies.set(accessToken, token, { expires: 30, secure: true })
      return true
   } catch (error) {
      throw {
         data: {
            messageTh: 'Set AccessToken error',
         },
      }
   }
}

export async function setRefreshToken(token: string): Promise<boolean> {
   try {
      Cookies.set(refreshToken, token, { expires: 30, secure: true })
      return true
   } catch (error) {
      throw {
         data: {
            messageTh: 'Set RefreshToken error',
         },
      }
   }
}

export async function removeAccessToken(): Promise<boolean> {
   try {
      Cookies.remove(accessToken)
      return true
   } catch (error) {
      throw {
         data: {
            messageTh: 'Remove AccessToken error',
         },
      }
   }
}

export async function removeRefreshToken(): Promise<boolean> {
   try {
      Cookies.remove(refreshToken)
      return true
   } catch (error) {
      throw {
         data: {
            messageTh: 'Remove RefreshToken error',
         },
      }
   }
}
