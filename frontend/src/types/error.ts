export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string>;
    };
  };
  message: string;
}
