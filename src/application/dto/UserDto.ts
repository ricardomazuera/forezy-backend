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