
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useHoldingsForm } from "@/hooks/use-holdings-form";
import { TokenHolding, NFTHolding } from "@/types/wallet";
import { useEffect } from "react";

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

const projectOptions: { value: string; label: string }[] = [
  { value: "DEBT", label: "DEBT" },
  { value: "DLG", label: "DLG" },
  { value: "ALUM", label: "ALUM" },
  { value: "XPLR", label: "XPLR" },
  { value: "BGLD", label: "BGLD" },
  { value: "NATG", label: "NATG" },
  { value: "DCM", label: "DCM" },
  { value: "GROW", label: "GROW" },
];

export function RecordHoldingsCard({ selectedWallet, wallets, onHoldingsUpdated }: RecordHoldingsCardProps) {
  const { form, isLoading, onSubmit, loadHoldings } = useHoldingsForm();

  useEffect(() => {
    if (selectedWallet && form.getValues("project_name")) {
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
  }, [selectedWallet, form.getValues("project_name"), wallets]);

  const handleWalletChange = (id: string) => {
    form.reset();
  };

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
        <Select
          value={selectedWallet || ""}
          onValueChange={handleWalletChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a wallet" />
          </SelectTrigger>
          <SelectContent>
            {wallets.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.id}>
                {wallet.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedWallet && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleProjectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.value} value={project.value}>
                            {project.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="total_nfts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Total NFTs
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Include both staked and unstaked NFTs</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="micro_nfts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Micro NFTs</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Tokens in Wallet
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total tokens in your wallet and piggy bank</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="piggy_bank_tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Piggy Bank Tokens</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
