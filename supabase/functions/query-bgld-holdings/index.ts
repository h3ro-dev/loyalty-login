
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
    const { address } = await req.json()
    
    if (!address || !ethers.utils.isAddress(address)) {
      throw new Error('Invalid Ethereum address')
    }

    // Initialize providers and contracts
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/" + Deno.env.get("ALCHEMY_API_KEY")
    )

    // ABI fragments for the functions we need
    const erc721ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function calculatePendingRewards(address user) view returns (uint256)"
    ]

    const erc20ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ]

    // Contract addresses (these should be environment variables in production)
    const BGLD_NFT_ADDRESS = "0x..." // BlackGold NFT address
    const BGLD_MICRO_NFT_ADDRESS = "0x..." // BlackGold Micro NFT address
    const BGLD_REWARD_DISTRIBUTOR = "0x..." // Legacy reward distributor
    const BGLD_REWARD_DISTRIBUTOR_DIAMOND = "0x..." // Diamond reward distributor

    // Initialize contracts
    const bgldNFT = new ethers.Contract(BGLD_NFT_ADDRESS, erc721ABI, provider)
    const bgldMicroNFT = new ethers.Contract(BGLD_MICRO_NFT_ADDRESS, erc20ABI, provider)
    const legacyRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR, erc721ABI, provider)
    const diamondRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR_DIAMOND, erc721ABI, provider)

    console.log(`Querying holdings for address: ${address}`)

    // Query all data in parallel
    const [
      nftBalance,
      microNFTBalance,
      legacyRewards,
      diamondRewards,
      microDecimals
    ] = await Promise.all([
      bgldNFT.balanceOf(address),
      bgldMicroNFT.balanceOf(address),
      legacyRewardDistributor.calculatePendingRewards(address).catch(() => ethers.BigNumber.from(0)),
      diamondRewardDistributor.calculatePendingRewards(address).catch(() => ethers.BigNumber.from(0)),
      bgldMicroNFT.decimals()
    ])

    console.log('NFT Balance:', nftBalance.toString())
    console.log('Micro NFT Balance:', microNFTBalance.toString())
    console.log('Legacy Rewards:', legacyRewards.toString())
    console.log('Diamond Rewards:', diamondRewards.toString())

    // Calculate total rewards (sum of legacy and diamond rewards)
    const totalRewards = legacyRewards.add(diamondRewards)

    // Convert micro NFT balance to proper decimal representation
    const microNFTBalanceAdjusted = Number(
      ethers.utils.formatUnits(microNFTBalance, microDecimals)
    )

    const holdings: BGLDHoldings = {
      total_nfts: nftBalance.toNumber(),
      micro_nfts: microNFTBalanceAdjusted,
      pending_rewards: Number(ethers.utils.formatEther(totalRewards))
    }

    return new Response(
      JSON.stringify(holdings),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
