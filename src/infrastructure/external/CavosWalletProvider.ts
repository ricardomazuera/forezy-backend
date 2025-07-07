import { CavosAuth } from 'cavos-service-sdk';

export class CavosWalletProvider {
  constructor(private orgSecret: string) {}

  async registerUser(email: string, password: string, network: string): Promise<{
    userId: string;
    email: string;
    wallet: {
      address: string;
      network: string;
      transactionHash: string;
      publicKey: string;
      privateKey: string;
    };
  }> {
    const userData = await CavosAuth.signUp(
      email,
      password,
      this.orgSecret,
      network
    );
    return {
      userId: userData.data.user_id,
      email: userData.data.email,
      wallet: {
        address: userData.data.wallet.address,
        network: userData.data.wallet.network,
        transactionHash: userData.data.wallet.transaction_hash,
        publicKey: userData.data.wallet.public_key,
        privateKey: userData.data.wallet.private_key
      }
    };
  }

} 