
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { ethers } from 'https://esm.sh/ethers@5.7.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BGLDHoldings {
  total_nfts: number;
  micro_nfts: number;
  pending_rewards: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, blockNumber } = await req.json()
    
    if (!address || !ethers.utils.isAddress(address)) {
      throw new Error('Invalid Ethereum address')
    }

    const ALCHEMY_KEY = Deno.env.get("ALCHEMY_API_KEY");
    if (!ALCHEMY_KEY) {
      console.error('ALCHEMY_API_KEY not found in environment variables');
      throw new Error('Alchemy API key not configured');
    }

    console.log('Initializing provider...');
    
    // Create a custom network configuration
    const network = {
      name: 'mainnet',
      chainId: 1,
      ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    };

    // Initialize provider with explicit network configuration
    const provider = new ethers.providers.StaticJsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      network
    );

    console.log('Provider initialized, testing connection...');
    try {
      const blockNumber = await provider.getBlockNumber();
      console.log('Connected to network, current block:', blockNumber);
    } catch (error) {
      console.error('Provider connection test failed:', error);
      throw new Error(`Provider connection test failed: ${error.message}`);
    }

    const BGLD_NFT_ADDRESS = "0x3abedba3052845ce3f57818032bfa747cded3fca";
    const BGLD_MICRO_NFT_ADDRESS = "0x935d2fd458fdf41ca227a009180de5bd32a6d116";
    const BGLD_REWARD_DISTRIBUTOR = "0x0c9fa52d7ed12a6316d3738c80931eccc33937dd";
    const BGLD_REWARD_DISTRIBUTOR_DIAMOND = "0xf751d2849b3659c81f3724814d5a8defb0bb8ad2";

    const erc721ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function calculatePendingRewards(address user) view returns (uint256)"
    ];

    const erc20ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];

    const overrides = blockNumber ? { blockTag: blockNumber } : {};
    console.log(`Querying at block: ${blockNumber || 'latest'}`);

    console.log('Creating contract instances...');
    const bgldNFT = new ethers.Contract(BGLD_NFT_ADDRESS, erc721ABI, provider);
    const bgldMicroNFT = new ethers.Contract(BGLD_MICRO_NFT_ADDRESS, erc20ABI, provider);
    const legacyRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR, erc721ABI, provider);
    const diamondRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR_DIAMOND, erc721ABI, provider);

    console.log(`Querying holdings for address: ${address}`);

    // Query balances and data
    let nftBalance, microNFTBalance, microDecimals, legacyRewards, diamondRewards;

    try {
      console.log('Fetching NFT balance...');
      nftBalance = await bgldNFT.balanceOf(address, overrides);
      console.log('NFT balance:', nftBalance.toString());
    } catch (error) {
      console.error('Error fetching NFT balance:', error);
      throw new Error(`Failed to fetch NFT balance: ${error.message}`);
    }

    try {
      console.log('Fetching Micro NFT balance...');
      microNFTBalance = await bgldMicroNFT.balanceOf(address, overrides);
      console.log('Micro NFT balance:', microNFTBalance.toString());

      console.log('Fetching Micro NFT decimals...');
      microDecimals = await bgldMicroNFT.decimals();
      console.log('Micro NFT decimals:', microDecimals);
    } catch (error) {
      console.error('Error fetching Micro NFT data:', error);
      throw new Error(`Failed to fetch Micro NFT data: ${error.message}`);
    }

    try {
      console.log('Fetching legacy rewards...');
      legacyRewards = await legacyRewardDistributor.calculatePendingRewards(address, overrides);
      console.log('Legacy rewards:', legacyRewards.toString());
    } catch (error) {
      console.error('Error fetching legacy rewards:', error);
      legacyRewards = ethers.BigNumber.from(0);
    }

    try {
      console.log('Fetching diamond rewards...');
      diamondRewards = await diamondRewardDistributor.calculatePendingRewards(address, overrides);
      console.log('Diamond rewards:', diamondRewards.toString());
    } catch (error) {
      console.error('Error fetching diamond rewards:', error);
      diamondRewards = ethers.BigNumber.from(0);
    }

    // Calculate final values
    const totalRewards = legacyRewards.add(diamondRewards);
    const microNFTBalanceAdjusted = Number(ethers.utils.formatUnits(microNFTBalance, microDecimals));

    const holdings: BGLDHoldings = {
      total_nfts: nftBalance.toNumber(),
      micro_nfts: microNFTBalanceAdjusted,
      pending_rewards: Number(ethers.utils.formatEther(totalRewards))
    };

    console.log('Final holdings:', holdings);

    return new Response(
      JSON.stringify(holdings),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = error instanceof Error ? error.stack : undefined;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
