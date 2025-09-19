import { apiEndPoint, ApiResponse } from '@/const/api'
import AxiosRefresh from '@/utils/axios/axiosAuth'
import axios, { AxiosResponse } from 'axios'

export type ticketform = {
   id: number;
   title: string;
   description?: string;
   priority: "LOW" | "MEDIUM" | "HIGH";
   status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export type ticketpayload = {
   title: string;
   description?: string;
   priority: "LOW" | "MEDIUM" | "HIGH";
   status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export interface ticketparams {
   status?: string;
   priority?: string;
   search?: string;
   page?: number;
   pageSize?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export const TicketApi = {
   create: async (body: ticketpayload): Promise<AxiosResponse<ApiResponse>> => {
      try {
         const response = await AxiosRefresh.post(
            `${apiEndPoint}/ticket`,
            body
         )
         return response
      } catch (error: any) {
         throw error
      }
   },
   getAll: async (params: ticketparams): Promise<AxiosResponse<ApiResponse>> => {
      try {
         const response = await AxiosRefresh.get(
            `${apiEndPoint}/ticket`,
            { params }
         )
         return response
      } catch (error: any) {
         throw error
      }
   },
   getById: async (id: number): Promise<AxiosResponse<ApiResponse>> => {
      try {
         const response = await AxiosRefresh.get(
            `${apiEndPoint}/ticket/${id}`
         )
         return response
      } catch (error: any) {
         throw error
      }
   },
   update: async (id: number, body: ticketpayload): Promise<AxiosResponse<ApiResponse>> => {
      try {
         const response = await AxiosRefresh.patch(
            `${apiEndPoint}/ticket/${id}`,
            body
         )
         return response
      } catch (error: any) {
         throw error
      }
   },
   delete: async (id: number): Promise<AxiosResponse<ApiResponse>> => {
      try {
         const response = await AxiosRefresh.delete(
            `${apiEndPoint}/ticket/${id}`
         )
         return response
      } catch (error: any) {
         throw error
      }
   }
}