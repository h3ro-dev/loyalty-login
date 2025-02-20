
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ethers } from 'npm:ethers@5.7.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ADDRESSES = {
  BLACK_GOLD_NFT: '0xAbC123AbC123AbC123AbC123AbC123AbC123AbC1',
  BLACK_GOLD_MICRO: '0xDeF456DeF456DeF456DeF456DeF456DeF456DeF4',
  REWARD_DISTRIBUTOR_DEPRECATED: '0x7890ab7890ab7890ab7890ab7890ab7890ab7890',
  REWARD_DISTRIBUTOR_DIAMOND: '0xCdef012Cdef012Cdef012Cdef012Cdef012Cdef0'
};

const blackGoldNFTAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

const blackGoldMicroAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const rewardDistributorAbi = [
  "function calculatePendingRewards(address user) view returns (uint256)",
  "event RewardClaimed(address indexed user, uint256 amount)"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()

    if (!address || !ethers.utils.isAddress(address)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Ethereum address' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Initialize provider with Alchemy
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-mainnet.alchemyapi.io/v2/${Deno.env.get('ALCHEMY_API_KEY')}`
    )

    // Initialize contracts
    const nftContract = new ethers.Contract(ADDRESSES.BLACK_GOLD_NFT, blackGoldNFTAbi, provider)
    const microContract = new ethers.Contract(ADDRESSES.BLACK_GOLD_MICRO, blackGoldMicroAbi, provider)

    // Query balances
    const [nftBalance, microBalance] = await Promise.all([
      nftContract.balanceOf(address),
      microContract.balanceOf(address)
    ])

    console.log(`Fetched balances for ${address}:`, {
      nftBalance: nftBalance.toString(),
      microBalance: microBalance.toString()
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          total_nfts: parseInt(nftBalance.toString()),
          micro_nfts: parseInt(microBalance.toString()),
          project_name: 'BGLD'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error querying blockchain:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to query blockchain data' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
