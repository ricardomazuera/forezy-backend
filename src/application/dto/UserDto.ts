export interface RegisterUserRequestDto {
  email: string;
  password: string;
}

export interface RegisterUserResponseDto {
  user_id: string;
  email: string;
  address: string;
}

export interface RegisterUserErrorResponseDto {
  error: string;
  message?: string;
}

export interface LoginUserRequestDto {
  email: string;
  password: string;
}

export interface LoginUserResponseDto {
  user_id_cavos: string;
  email: string;
  access_token: string;
  address: string;
}

export interface LoginUserErrorResponseDto {
  error: string;
  message?: string;
} 