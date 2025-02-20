import React, { useState } from 'react';
import { fetchBscKey, testBGLDAddress, type TestResult } from '@/services/bgld-service';

export default function VoucherGeneration() {
  const [email, setEmail] = useState('');
  const [walletsString, setWalletsString] = useState('');
  const [cutoffBlock, setCutoffBlock] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voucher, setVoucher] = useState<{
    email: string;
    cutoffBlock: string;
    totalNFTs: number;
    microNFTs: number;
    pendingRewards: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVoucher = async () => {
    setIsLoading(true);
    setError(null);
    setVoucher(null);

    try {
      const bscKey = await fetchBscKey();
      if (!bscKey) {
        throw new Error('Failed to retrieve BSC API Key');
      }
      // Parse wallet addresses from comma separated input
      const wallets = walletsString
        .split(',')
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

      let aggregatedNFTs = 0;
      let aggregatedMicroNFTs = 0;
      let aggregatedPendingRewards = 0;

      for (const wallet of wallets) {
        // Using testBGLDAddress as a placeholder. In production, use the appropriate contract call, including blockTag support.
        const result: TestResult = await testBGLDAddress(wallet, bscKey, cutoffBlock);
        aggregatedNFTs += result.total_nfts;
        aggregatedMicroNFTs += result.micro_nfts;
        aggregatedPendingRewards += result.pending_rewards;
      }

      setVoucher({
        email,
        cutoffBlock,
        totalNFTs: aggregatedNFTs,
        microNFTs: aggregatedMicroNFTs,
        pendingRewards: aggregatedPendingRewards
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Voucher Generation</h1>
        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Wallet Addresses (comma separated):</label>
          <textarea
            value={walletsString}
            onChange={(e) => setWalletsString(e.target.value)}
            className="p-2 border rounded w-full"
            rows={3}
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1">Cutoff Block:</label>
          <input
            type="text"
            value={cutoffBlock}
            onChange={(e) => setCutoffBlock(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          onClick={handleGenerateVoucher}
          disabled={isLoading}
          className="p-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? 'Generating Voucher...' : 'Generate Voucher'}
        </button>
        {voucher && (
          <div className="p-4 border rounded mt-4">
            <h2 className="font-bold mb-2">Voucher Draft</h2>
            <p><strong>Email:</strong> {voucher.email}</p>
            <p><strong>Cutoff Block:</strong> {voucher.cutoffBlock}</p>
            <p><strong>Total NFTs:</strong> {voucher.totalNFTs}</p>
            <p><strong>Micro NFTs:</strong> {voucher.microNFTs}</p>
            <p><strong>Pending Rewards:</strong> {voucher.pendingRewards}</p>
          </div>
        )}
        {error && (
          <div className="p-4 border rounded mt-4 text-red-600">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 