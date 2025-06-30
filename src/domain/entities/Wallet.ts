export interface Wallet {
  id?: string;
  authUid: string;
  publicKey: string;
  encryptedPrivateKey: string;
  address: string;
  createdAt?: Date;
}

export interface WalletCreationRequest {
  authUid: string;
  network: string ;
}

export interface WalletCreationResponse {
  publicKey: string;
  privateKey: string;
  address: string;
} 