export interface ApiResponse {
  message?: string;
  version?: string;
  status?: string;
  error?: string;
  timestamp?: string;
  data?: any;
  details?: any;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp?: string;
} 