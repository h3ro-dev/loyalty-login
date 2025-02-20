
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useHoldingsForm } from "@/hooks/use-holdings-form";
import { TokenHolding, NFTHolding } from "@/types/wallet";
import { useEffect } from "react";
import { WalletSelect } from "./holdings/wallet-select";
import { ProjectSelect } from "./holdings/project-select";
import { HoldingsFields } from "./holdings/holdings-fields";

interface RecordHoldingsCardProps {
  selectedWallet: string | null;
  wallets: Array<{
    id: string;
    address: string;
    tokenHoldings: TokenHolding[];
    nftHoldings: NFTHolding[];
  }>;
  onHoldingsUpdated: () => void;
}

export function RecordHoldingsCard({ selectedWallet, wallets, onHoldingsUpdated }: RecordHoldingsCardProps) {
  const { form, isLoading, onSubmit, loadHoldings } = useHoldingsForm();

  useEffect(() => {
    if (selectedWallet) {
      const currentWallet = wallets.find(w => w.id === selectedWallet);
      if (currentWallet) {
        const projectName = form.getValues("project_name");
        const tokenHolding = currentWallet.tokenHoldings.find(th => th.projectName === projectName);
        const nftHolding = currentWallet.nftHoldings.find(nh => nh.projectName === projectName);
        
        loadHoldings({
          project_name: projectName,
          total_tokens: tokenHolding?.totalTokens || 0,
          piggy_bank_tokens: tokenHolding?.piggyBankTokens || 0,
          total_nfts: nftHolding?.totalNFTs || 0,
          micro_nfts: nftHolding?.microNFTs || 0,
        });
      }
    }
  }, [selectedWallet, wallets]);

  const handleProjectChange = (value: string) => {
    form.setValue("project_name", value);
    if (selectedWallet) {
      const currentWallet = wallets.find(w => w.id === selectedWallet);
      if (currentWallet) {
        const tokenHolding = currentWallet.tokenHoldings.find(th => th.projectName === value);
        const nftHolding = currentWallet.nftHoldings.find(nh => nh.projectName === value);
        
        loadHoldings({
          project_name: value,
          total_tokens: tokenHolding?.totalTokens || 0,
          piggy_bank_tokens: tokenHolding?.piggyBankTokens || 0,
          total_nfts: nftHolding?.totalNFTs || 0,
          micro_nfts: nftHolding?.microNFTs || 0,
        });
      }
    }
  };

  const handleWalletSelect = (value: string) => {
    form.reset();
    handleProjectChange(form.getValues("project_name"));
    onHoldingsUpdated();
  };

  const handleSubmit = async (values: any) => {
    if (!selectedWallet) return;
    const success = await onSubmit(values, selectedWallet);
    if (success) {
      onHoldingsUpdated();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Holdings</CardTitle>
        <CardDescription>
          Select a wallet and record your project holdings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <WalletSelect
          selectedWallet={selectedWallet}
          wallets={wallets}
          onWalletSelect={handleWalletSelect}
        />

        {selectedWallet && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <ProjectSelect form={form} onProjectChange={handleProjectChange} />
              <HoldingsFields form={form} />

              <FormDescription className="text-sm text-muted-foreground">
                Note: All wallet holdings will be verified against the blockchain snapshot taken when the ecosystem was shut off. If the numbers don't match, the system will use the on-chain data.
              </FormDescription>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Recording..." : "Record Holdings"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
