export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
  confirmPassword: string;
}
