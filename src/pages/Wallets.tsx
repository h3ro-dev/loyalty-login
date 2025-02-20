import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ConnectWalletCard } from "@/components/wallets/connect-wallet-card";
import { RecordHoldingsCard } from "@/components/wallets/record-holdings-card";
import { ConnectedWalletsCard } from "@/components/wallets/connected-wallets-card";
import { TokenHolding, NFTHolding } from "@/types/wallet";

interface Wallet {
  id: string;
  address: string;
  nickname: string;
  tokenHoldings: TokenHolding[];
  nftHoldings: NFTHolding[];
}

export default function Wallets() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/auth");
    }
  };

  const fetchWallets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: walletsData, error: walletsError } = await supabase
        .from("wallets")
        .select("*")
        .eq("profile_id", user.id);

      if (walletsError) throw walletsError;

      const walletsWithHoldings = await Promise.all(
        walletsData.map(async (wallet) => {
          const [{ data: tokenHoldings }, { data: nftHoldings }] = await Promise.all([
            supabase
              .from("token_holdings")
              .select("*")
              .eq("wallet_id", wallet.id),
            supabase
              .from("nft_holdings")
              .select("*")
              .eq("wallet_id", wallet.id),
          ]);

          return {
            ...wallet,
            tokenHoldings: (tokenHoldings || []).map(th => ({
              projectName: th.project_name,
              totalTokens: th.total_tokens,
              piggyBankTokens: th.piggy_bank_tokens
            })),
            nftHoldings: (nftHoldings || []).map(nh => ({
              projectName: nh.project_name,
              totalNFTs: nh.total_nfts,
              microNFTs: nh.micro_nfts
            }))
          };
        })
      );

      console.log("Fetched wallets:", walletsWithHoldings);
      setWallets(walletsWithHoldings);
      
      if (!selectedWallet && walletsWithHoldings.length > 0) {
        setSelectedWallet(walletsWithHoldings[0].id);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleWalletSelect = (walletId: string) => {
    console.log("Setting selected wallet to:", walletId);
    setSelectedWallet(walletId);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container max-w-4xl py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              Chrysalis
            </Link>
            <Link to="/wallets" className="text-sm font-medium">
              Wallets
            </Link>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container max-w-4xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wallets</h1>
            <p className="text-muted-foreground">
              Manage your connected wallets and record your holdings
            </p>
          </div>
        </div>

        <ConnectWalletCard onWalletAdded={fetchWallets} />

        {wallets.length > 0 && (
          <>
            <RecordHoldingsCard
              selectedWallet={selectedWallet}
              wallets={wallets}
              onHoldingsUpdated={fetchWallets}
              onWalletSelect={handleWalletSelect}
            />
            <ConnectedWalletsCard 
              wallets={wallets} 
              onWalletUpdated={fetchWallets}
            />
          </>
        )}
      </div>
    </div>
  );
}
