export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    preferences?: {
      theme: 'light' | 'dark';
      notifications: boolean;
      language: string;
    };
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}