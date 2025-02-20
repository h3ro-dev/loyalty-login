
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TokenHolding, NFTHolding } from "@/types/wallet";

interface ConnectedWalletsCardProps {
  wallets: Array<{
    id: string;
    address: string;
    nickname: string;
    tokenHoldings: TokenHolding[];
    nftHoldings: NFTHolding[];
  }>;
  onWalletUpdated: () => void;
}

export function ConnectedWalletsCard({ wallets, onWalletUpdated }: ConnectedWalletsCardProps) {
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [editingNickname, setEditingNickname] = useState("");

  const handleEditClick = (wallet: { id: string; nickname: string }) => {
    setEditingWalletId(wallet.id);
    setEditingNickname(wallet.nickname || "");
  };

  const handleSaveNickname = async (walletId: string) => {
    try {
      const { error } = await supabase
        .from("wallets")
        .update({ nickname: editingNickname })
        .eq("id", walletId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Wallet nickname updated successfully",
      });
      
      setEditingWalletId(null);
      onWalletUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wallet nickname",
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
              <div className="space-y-1">
                {editingWalletId === wallet.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingNickname}
                      onChange={(e) => setEditingNickname(e.target.value)}
                      placeholder="Enter wallet nickname"
                      className="max-w-[200px]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveNickname(wallet.id)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{wallet.nickname}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(wallet)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{wallet.address}</p>
              </div>
            </div>
            
            {wallet.tokenHoldings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Token Holdings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {wallet.tokenHoldings.map((token, index) => (
                    <Card key={`${wallet.id}-token-${index}`}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium">{token.projectName}</div>
                          <div className="text-sm text-muted-foreground">
                            Total: {token.totalTokens}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Piggy Bank: {token.piggyBankTokens}
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
                  {wallet.nftHoldings.map((nft, index) => (
                    <Card key={`${wallet.id}-nft-${index}`}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium">{nft.projectName}</div>
                          <div className="text-sm text-muted-foreground">
                            Total: {nft.totalNFTs}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Micro NFTs: {nft.microNFTs}
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
