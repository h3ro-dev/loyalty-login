
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TokenHolding {
  id: string;
  project_name: string;
  total_tokens: number;
  piggy_bank_tokens: number;
}

interface NFTHolding {
  id: string;
  project_name: string;
  total_nfts: number;
  micro_nfts: number;
}

interface Wallet {
  id: string;
  address: string;
  tokenHoldings: TokenHolding[];
  nftHoldings: NFTHolding[];
}

interface Props {
  wallets: Wallet[];
  onWalletsUpdated: () => void;
}

export function WalletDisplay({ wallets, onWalletsUpdated }: Props) {
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState("");

  const handleEditStart = (wallet: Wallet) => {
    setEditingWallet(wallet.id);
    setEditAddress(wallet.address);
  };

  const handleEditCancel = () => {
    setEditingWallet(null);
    setEditAddress("");
  };

  const handleEditSave = async (walletId: string) => {
    try {
      const { error } = await supabase
        .from("wallets")
        .update({ address: editAddress })
        .eq("id", walletId);

      if (error) throw error;

      toast({
        title: "Wallet updated",
        description: "The wallet address has been updated successfully.",
      });

      setEditingWallet(null);
      setEditAddress("");
      onWalletsUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Wallets</CardTitle>
        <CardDescription>
          View and manage your connected wallets and their holdings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="space-y-4">
            <div className="flex items-center justify-between">
              {editingWallet === wallet.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="max-w-md"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditSave(wallet.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{wallet.address}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditStart(wallet)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {wallet.tokenHoldings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Token Holdings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {wallet.tokenHoldings.map((token) => (
                    <Card key={token.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium">{token.project_name}</div>
                          <div className="text-sm text-muted-foreground">
                            Total: {token.total_tokens}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Piggy Bank: {token.piggy_bank_tokens}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {wallet.nftHoldings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">NFT Holdings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {wallet.nftHoldings.map((nft) => (
                    <Card key={nft.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium">{nft.project_name}</div>
                          <div className="text-sm text-muted-foreground">
                            Total: {nft.total_nfts}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Micro NFTs: {nft.micro_nfts}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
