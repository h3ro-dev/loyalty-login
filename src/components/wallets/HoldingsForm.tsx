
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type ProjectName = "DEBT" | "CHRS" | "ALUM" | "BAUX" | "BGLD" | "OIL" | "DCM" | "DATA" | "DLG" | "GDLG" | "GROW" | "FARM" | "NATG" | "NGAS" | "XPLR" | "EXPL";

const holdingsSchema = z.object({
  project_name: z.enum(["DEBT", "CHRS", "ALUM", "BAUX", "BGLD", "OIL", "DCM", "DATA", "DLG", "GDLG", "GROW", "FARM", "NATG", "NGAS", "XPLR", "EXPL"]),
  total_nfts: z.number().min(0, "Must be 0 or greater"),
  micro_nfts: z.number().min(0, "Must be 0 or greater"),
  total_tokens: z.number().min(0, "Must be 0 or greater"),
  piggy_bank_tokens: z.number().min(0, "Must be 0 or greater"),
});

type HoldingsFormValues = z.infer<typeof holdingsSchema>;

interface Props {
  wallets: {
    id: string;
    address: string;
  }[];
  selectedWallet: string | null;
  onWalletSelect: (id: string) => void;
  onHoldingsUpdated: () => void;
}

const projectOptions: { value: ProjectName; label: string }[] = [
  { value: "DEBT", label: "DEBT" },
  { value: "DLG", label: "DLG" },
  { value: "ALUM", label: "ALUM" },
  { value: "XPLR", label: "XPLR" },
  { value: "BGLD", label: "BGLD" },
  { value: "NATG", label: "NATG" },
  { value: "DCM", label: "DCM" },
  { value: "GROW", label: "GROW" },
];

export function HoldingsForm({ wallets, selectedWallet, onWalletSelect, onHoldingsUpdated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const form = useForm<HoldingsFormValues>({
    resolver: zodResolver(holdingsSchema),
    defaultValues: {
      project_name: "DEBT",
      total_nfts: 0,
      micro_nfts: 0,
      total_tokens: 0,
      piggy_bank_tokens: 0,
    },
  });

  const onSubmit = async (values: HoldingsFormValues) => {
    if (!selectedWallet) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a wallet first",
      });
      return;
    }

    setIsLoading(true);
    try {
      const selectedWalletData = wallets.find(w => w.id === selectedWallet);
      if (!selectedWalletData || !user) throw new Error("Invalid wallet or user");

      const [{ data: existingTokenHoldings }, { data: existingNFTHoldings }] = await Promise.all([
        supabase
          .from("token_holdings")
          .select("id")
          .eq("wallet_id", selectedWallet)
          .eq("project_name", values.project_name)
          .maybeSingle(),
        supabase
          .from("nft_holdings")
          .select("id")
          .eq("wallet_id", selectedWallet)
          .eq("project_name", values.project_name)
          .maybeSingle(),
      ]);

      if (existingTokenHoldings?.id) {
        const { error: tokenError } = await supabase
          .from("token_holdings")
          .update({
            total_tokens: values.total_tokens,
            piggy_bank_tokens: values.piggy_bank_tokens,
          })
          .eq("id", existingTokenHoldings.id);

        if (tokenError) throw tokenError;
      } else {
        const { error: tokenError } = await supabase
          .from("token_holdings")
          .insert({
            wallet_id: selectedWallet,
            project_name: values.project_name,
            total_tokens: values.total_tokens,
            piggy_bank_tokens: values.piggy_bank_tokens,
          });

        if (tokenError) throw tokenError;
      }

      if (existingNFTHoldings?.id) {
        const { error: nftError } = await supabase
          .from("nft_holdings")
          .update({
            total_nfts: values.total_nfts,
            micro_nfts: values.micro_nfts,
          })
          .eq("id", existingNFTHoldings.id);

        if (nftError) throw nftError;
      } else {
        const { error: nftError } = await supabase
          .from("nft_holdings")
          .insert({
            wallet_id: selectedWallet,
            project_name: values.project_name,
            total_nfts: values.total_nfts,
            micro_nfts: values.micro_nfts,
            block_number: 0,
            user_id: user.id,
            wallet_address: selectedWalletData.address
          });

        if (nftError) throw nftError;
      }

      toast({
        title: existingTokenHoldings || existingNFTHoldings ? "Holdings updated" : "Holdings added",
        description: `Your holdings have been successfully ${existingTokenHoldings || existingNFTHoldings ? "updated" : "recorded"}.`,
      });
      
      form.reset();
      onHoldingsUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
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
          onValueChange={onWalletSelect}
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
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
