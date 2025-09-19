export const apiEndPoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const frontEndUrl = process.env.NEXT_PUBLIC_FRONT_END_URL;

export type ApiResponse = {
  statusCode: number;
  data: any;
  messageEN: string;
  messageTH: string;
  total?: number;
};

export type BaseResponseType = {
  id: number;
  isActive: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
};
