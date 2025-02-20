
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, blockNumber } = await req.json()
    
    if (!address || !ethers.utils.isAddress(address)) {
      throw new Error('Invalid Ethereum address')
    }

    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/" + Deno.env.get("ALCHEMY_API_KEY")
    )

    // Verify provider connection
    try {
      await provider.getNetwork()
    } catch (error) {
      console.error('Provider connection error:', error)
      throw new Error('Failed to connect to Ethereum network')
    }

    const erc721ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function calculatePendingRewards(address user) view returns (uint256)"
    ]

    const erc20ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ]

    const BGLD_NFT_ADDRESS = "0x3abedba3052845ce3f57818032bfa747cded3fca"
    const BGLD_MICRO_NFT_ADDRESS = "0x935d2fd458fdf41ca227a009180de5bd32a6d116"
    const BGLD_REWARD_DISTRIBUTOR = "0x0c9fa52d7ed12a6316d3738c80931eccc33937dd"
    const BGLD_REWARD_DISTRIBUTOR_DIAMOND = "0xf751d2849b3659c81f3724814d5a8defb0bb8ad2"

    const overrides = blockNumber ? { blockTag: blockNumber } : {}
    console.log(`Querying at block: ${blockNumber || 'latest'}`)
    console.log('Using overrides:', overrides)

    const bgldNFT = new ethers.Contract(BGLD_NFT_ADDRESS, erc721ABI, provider)
    const bgldMicroNFT = new ethers.Contract(BGLD_MICRO_NFT_ADDRESS, erc20ABI, provider)
    const legacyRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR, erc721ABI, provider)
    const diamondRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR_DIAMOND, erc721ABI, provider)

    console.log(`Querying holdings for address: ${address}`)

    // Query each contract separately to better identify issues
    let nftBalance, microNFTBalance, legacyRewards, diamondRewards, microDecimals;

    try {
      nftBalance = await bgldNFT.balanceOf(address, overrides)
      console.log('NFT Balance:', nftBalance.toString())
    } catch (error) {
      console.error('Error fetching NFT balance:', error)
      throw new Error('Failed to fetch NFT balance')
    }

    try {
      microNFTBalance = await bgldMicroNFT.balanceOf(address, overrides)
      console.log('Micro NFT Balance:', microNFTBalance.toString())
    } catch (error) {
      console.error('Error fetching Micro NFT balance:', error)
      throw new Error('Failed to fetch Micro NFT balance')
    }

    try {
      microDecimals = await bgldMicroNFT.decimals()
      console.log('Micro NFT Decimals:', microDecimals)
    } catch (error) {
      console.error('Error fetching Micro NFT decimals:', error)
      throw new Error('Failed to fetch Micro NFT decimals')
    }

    try {
      legacyRewards = await legacyRewardDistributor.calculatePendingRewards(address, overrides)
      console.log('Legacy Rewards:', legacyRewards.toString())
    } catch (error) {
      console.error('Error fetching legacy rewards:', error)
      legacyRewards = ethers.BigNumber.from(0)
    }

    try {
      diamondRewards = await diamondRewardDistributor.calculatePendingRewards(address, overrides)
      console.log('Diamond Rewards:', diamondRewards.toString())
    } catch (error) {
      console.error('Error fetching diamond rewards:', error)
      diamondRewards = ethers.BigNumber.from(0)
    }

    const totalRewards = (legacyRewards || ethers.BigNumber.from(0))
      .add(diamondRewards || ethers.BigNumber.from(0))
    
    const microNFTBalanceAdjusted = Number(
      ethers.utils.formatUnits(microNFTBalance, microDecimals)
    )

    const holdings: BGLDHoldings = {
      total_nfts: nftBalance.toNumber(),
      micro_nfts: microNFTBalanceAdjusted,
      pending_rewards: Number(ethers.utils.formatEther(totalRewards))
    }

    console.log('Final holdings:', holdings)

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
    console.error('Error in edge function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
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
