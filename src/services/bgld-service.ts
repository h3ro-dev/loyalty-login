
import { ethers } from "ethers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface TestResult {
  address: string;
  total_nfts: number;
  micro_nfts: number;
  pending_rewards: number;
  error?: string;
}

export async function fetchBscKey() {
  const { data: apiKey, error: keyError } = await supabase
    .rpc('get_secret', { 
      secret_name: 'BSC_API_KEY'
    });
  
  if (keyError) {
    console.error('Error fetching BSC key:', keyError);
    toast({
      variant: "destructive",
      title: "API Key Error",
      description: "Failed to fetch the BSC API key."
    });
    return null;
  }
  
  if (!apiKey) {
    toast({
      variant: "destructive",
      title: "API Key Not Found",
      description: "BSC API key not found in Supabase settings."
    });
    return null;
  }

  return apiKey as string;
}

export async function testBGLDAddress(address: string, bscKey: string): Promise<TestResult> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://bnb-mainnet.g.alchemy.com/v2/${bscKey}`
    );

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

    const bgldNFT = new ethers.Contract(BGLD_NFT_ADDRESS, erc721ABI, provider);
    const bgldMicroNFT = new ethers.Contract(BGLD_MICRO_NFT_ADDRESS, erc20ABI, provider);
    const legacyRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR, erc721ABI, provider);
    const diamondRewardDistributor = new ethers.Contract(BGLD_REWARD_DISTRIBUTOR_DIAMOND, erc721ABI, provider);

    const [
      nftBalance,
      microNFTBalance,
      microDecimals,
      legacyRewards,
      diamondRewards
    ] = await Promise.all([
      bgldNFT.balanceOf(address),
      bgldMicroNFT.balanceOf(address),
      bgldMicroNFT.decimals(),
      legacyRewardDistributor.calculatePendingRewards(address)
        .catch(() => ethers.BigNumber.from(0)),
      diamondRewardDistributor.calculatePendingRewards(address)
        .catch(() => ethers.BigNumber.from(0))
    ]);

    const totalRewards = legacyRewards.add(diamondRewards);
    const microNFTBalanceAdjusted = Number(ethers.utils.formatUnits(microNFTBalance, microDecimals));

    const holdings: TestResult = {
      address,
      total_nfts: nftBalance.toNumber(),
      micro_nfts: microNFTBalanceAdjusted,
      pending_rewards: Number(ethers.utils.formatEther(totalRewards))
    };

    await storeResults(holdings);
    return holdings;

  } catch (error: any) {
    return {
      address,
      total_nfts: 0,
      micro_nfts: 0,
      pending_rewards: 0,
      error: error.message
    };
  }
}

async function storeResults(holdings: TestResult) {
  const { error: dbError } = await supabase
    .from('nft_holdings')
    .upsert({
      wallet_id: holdings.address,
      project_name: 'BGLD',
      total_nfts: holdings.total_nfts,
      micro_nfts: holdings.micro_nfts
    });

  if (dbError) {
    toast({
      variant: "destructive",
      title: "Error storing results",
      description: dbError.message
    });
  }
}
