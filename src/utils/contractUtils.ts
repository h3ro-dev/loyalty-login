import { ethers } from 'ethers';

// Fetches generic data from a contract method at a specific block
export async function fetchContractData({
  providerUrl,
  contractAddress,
  abi,
  method,
  params = [],
  blockTag
}) {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const options = blockTag ? { blockTag } : {};
  // Dynamically call the specified method with parameters and options
  const data = await contract[method](...params, options);
  return data;
}

// Helper to fetch a wallet's token balance from a contract at a specified block
export async function fetchWalletBalance({
  providerUrl,
  contractAddress,
  abi,
  walletAddress,
  blockTag
}) {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const options = blockTag ? { blockTag } : {};
  // Assumes the contract has a 'balanceOf' method
  const balance = await contract.balanceOf(walletAddress, options);
  return balance;
} 