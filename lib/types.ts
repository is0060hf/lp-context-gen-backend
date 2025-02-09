export interface FormData {
  [key: string]: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}
