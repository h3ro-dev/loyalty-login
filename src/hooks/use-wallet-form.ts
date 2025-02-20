
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProjectName } from "@/types/wallet";

const walletSchema = z.object({
  address: z.string().min(42, "Invalid wallet address").max(42, "Invalid wallet address"),
});

export type WalletFormValues = z.infer<typeof walletSchema>;

export function useWalletForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      address: "",
    },
  });

  const fetchOnChainData = async (address: string, project: ProjectName) => {
    if (project !== 'BGLD') return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('query-bgld-holdings', {
        body: { address }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching on-chain data:', error);
      return null;
    }
  };

  const onSubmit = async (values: WalletFormValues) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const onChainData = await fetchOnChainData(values.address, 'BGLD');
      
      if (onChainData) {
        toast({
          title: "On-chain data found",
          description: "We've detected your BGLD holdings from the blockchain.",
        });
      }

      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .insert({
          address: values.address,
          profile_id: user.id,
        })
        .select()
        .single();

      if (walletError) throw walletError;

      if (onChainData && walletData) {
        const { error: nftError } = await supabase
          .from("nft_holdings")
          .insert({
            wallet_id: walletData.id,
            project_name: 'BGLD',
            total_nfts: onChainData.total_nfts,
            micro_nfts: onChainData.micro_nfts,
          });

        if (nftError) throw nftError;
      }

      toast({
        title: "Wallet added",
        description: "Your wallet has been successfully connected.",
      });
      
      form.reset();
      return walletData;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return null;
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
