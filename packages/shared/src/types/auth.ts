export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    emailVerified: boolean;
  };
}

export type { AuthResponse as LoginResponse };
