
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PROJECT_CONVERSIONS } from "@/types/wallet";

const holdingsSchema = z.object({
  project_name: z.enum(Object.keys(PROJECT_CONVERSIONS) as [string, ...string[]]),
  total_nfts: z.number().min(0, "Must be 0 or greater"),
  micro_nfts: z.number().min(0, "Must be 0 or greater"),
  total_tokens: z.number().min(0, "Must be 0 or greater"),
  piggy_bank_tokens: z.number().min(0, "Must be 0 or greater"),
});

export type HoldingsFormValues = z.infer<typeof holdingsSchema>;

export function useHoldingsForm() {
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: HoldingsFormValues, walletId: string) => {
    setIsLoading(true);
    try {
      const [{ data: existingTokenHoldings }, { data: existingNFTHoldings }] = await Promise.all([
        supabase
          .from("token_holdings")
          .select("id")
          .eq("wallet_id", walletId)
          .eq("project_name", values.project_name)
          .maybeSingle(),
        supabase
          .from("nft_holdings")
          .select("id")
          .eq("wallet_id", walletId)
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
            wallet_id: walletId,
            project_name: values.project_name,
            total_tokens: values.total_tokens,
            piggy_bank_tokens: values.piggy_bank_tokens,
          } as const);

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
            wallet_id: walletId,
            project_name: values.project_name,
            total_nfts: values.total_nfts,
            micro_nfts: values.micro_nfts,
          } as const);

        if (nftError) throw nftError;
      }

      toast({
        title: existingTokenHoldings || existingNFTHoldings ? "Holdings updated" : "Holdings added",
        description: `Your holdings have been successfully ${existingTokenHoldings || existingNFTHoldings ? "updated" : "recorded"}.`,
      });
      
      form.reset();
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
}
