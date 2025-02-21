
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
  staked_debt_tokens: number;
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

interface EditingState {
  type: 'token' | 'nft';
  holdingId: string;
  field: string;
  value: number;
}

export function WalletDisplay({ wallets, onWalletsUpdated }: Props) {
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState("");
  const [editingHolding, setEditingHolding] = useState<EditingState | null>(null);

  const handleEditStart = (wallet: Wallet) => {
    setEditingWallet(wallet.id);
    setEditAddress(wallet.address);
  };

  const handleEditCancel = () => {
    setEditingWallet(null);
    setEditAddress("");
    setEditingHolding(null);
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

  const handleHoldingEditStart = (type: 'token' | 'nft', holdingId: string, field: string, value: number) => {
    setEditingHolding({
      type,
      holdingId,
      field,
      value,
    });
  };

  const handleHoldingEditCancel = () => {
    setEditingHolding(null);
  };

  const handleHoldingEditSave = async () => {
    if (!editingHolding) return;

    try {
      const { type, holdingId, field, value } = editingHolding;
      const table = type === 'token' ? 'token_holdings' : 'nft_holdings';
      
      const { error } = await supabase
        .from(table)
        .update({ [field]: value })
        .eq("id", holdingId);

      if (error) throw error;

      toast({
        title: "Holding updated",
        description: "The holding value has been updated successfully.",
      });

      setEditingHolding(null);
      onWalletsUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const renderEditableValue = (
    type: 'token' | 'nft',
    holdingId: string,
    field: string,
    value: number,
    label: string
  ) => {
    const isEditing = editingHolding?.holdingId === holdingId && editingHolding?.field === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={editingHolding.value}
            onChange={(e) => setEditingHolding({
              ...editingHolding,
              value: e.target.value === '' ? 0 : Number(e.target.value)
            })}
            className="w-32"
            onFocus={(e) => e.target.select()}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHoldingEditSave}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHoldingEditCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {label}: {value}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => handleHoldingEditStart(type, holdingId, field, value)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
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
                          {renderEditableValue('token', token.id, 'total_tokens', token.total_tokens, 'Total')}
                          {renderEditableValue('token', token.id, 'piggy_bank_tokens', token.piggy_bank_tokens, 'Piggy Bank')}
                          {token.project_name === 'DEBT' && (
                            renderEditableValue('token', token.id, 'staked_debt_tokens', token.staked_debt_tokens, 'Staked DEBT')
                          )}
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
                          {renderEditableValue('nft', nft.id, 'total_nfts', nft.total_nfts, 'Total')}
                          {renderEditableValue('nft', nft.id, 'micro_nfts', nft.micro_nfts, 'Micro NFTs')}
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
