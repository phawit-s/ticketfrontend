import { apiEndPoint, ApiResponse } from '@/const/api'
import AxiosRefresh from '@/utils/axios/axiosAuth'
import axios, { AxiosResponse } from 'axios'


export const QueueApi = {
    find: async (name: "sla-queue" | "notification-queue"): Promise<AxiosResponse<ApiResponse>> => {
        try {
            const response = await AxiosRefresh.get(
                `${apiEndPoint}/admin/queues/${name}/stats`
            )
            return response
        } catch (error: any) {
            throw error
        }
    },
}