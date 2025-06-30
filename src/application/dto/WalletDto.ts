export interface CreateWalletRequestDto {
  auth_uid: string;
  network?: string;
}

export interface CreateWalletResponseDto {
  public_key: string;
  private_key: string;
  address: string;
}

export interface WalletErrorResponseDto {
  error: string;
  message?: string;
} 