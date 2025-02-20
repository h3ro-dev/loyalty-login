
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

    const bgldNFT = new ethers.Contract(BGLD_NFT_ADDRESS, erc721ABI, provider)
    const bgldMicroNFT = new ethers.Contract(BGLD_MICRO_NFT_ADDRESS, erc20ABI, provider)
    const legacyRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR, erc721ABI, provider)
    const diamondRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR_DIAMOND, erc721ABI, provider)

    console.log(`Querying holdings for address: ${address}`)

    const [
      nftBalance,
      microNFTBalance,
      legacyRewards,
      diamondRewards,
      microDecimals
    ] = await Promise.all([
      bgldNFT.balanceOf(address, overrides),
      bgldMicroNFT.balanceOf(address, overrides),
      legacyRewardDistributor.calculatePendingRewards(address, overrides).catch(() => ethers.BigNumber.from(0)),
      diamondRewardDistributor.calculatePendingRewards(address, overrides).catch(() => ethers.BigNumber.from(0)),
      bgldMicroNFT.decimals()
    ])

    console.log('NFT Balance:', nftBalance.toString())
    console.log('Micro NFT Balance:', microNFTBalance.toString())
    console.log('Legacy Rewards:', legacyRewards.toString())
    console.log('Diamond Rewards:', diamondRewards.toString())

    const totalRewards = legacyRewards.add(diamondRewards)
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
