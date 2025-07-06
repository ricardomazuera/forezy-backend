import { RpcProvider, Contract } from 'starknet';

const STRK_CONTRACT_ADDRESS = '0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D';

const erc20ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'felt' }],
    outputs: [{ name: 'balance', type: 'felt' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: 'decimals', type: 'felt' }],
    stateMutability: 'view',
  },
];

const SEPOLIA_RPC_URL = 'https://starknet-sepolia.public.blastapi.io/rpc/v0_6';

function extractValue(result: any, key: string): string {
  if (typeof result === 'object' && result !== null) {
    if (key in result) return result[key];
    if (Array.isArray(result)) return result[0];
  }
  if (Array.isArray(result)) return result[0];
  return result;
}

export async function getStrkBalance(address: string): Promise<number> {
  const provider = new RpcProvider({ nodeUrl: SEPOLIA_RPC_URL });
  const contract = new Contract(erc20ABI, STRK_CONTRACT_ADDRESS, provider);
  const balanceResult = await contract.call('balanceOf', [address]);
  const decimalsResult = await contract.call('decimals');
  const balance = BigInt(extractValue(balanceResult, 'balance'));
  const decimals = Number(extractValue(decimalsResult, 'decimals'));
  return Number(balance) / 10 ** decimals;
} 