
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const walletSchema = z.object({
  address: z.string().min(42, "Invalid wallet address").max(42, "Invalid wallet address"),
});

type WalletFormValues = z.infer<typeof walletSchema>;

interface Props {
  onWalletAdded: () => void;
}

export function WalletConnect({ onWalletAdded }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      address: "",
    },
  });

  const fetchOnChainData = async (address: string) => {
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

      const onChainData = await fetchOnChainData(values.address);
      
      if (onChainData) {
        toast({
          title: "On-chain data found",
          description: "We've detected your BGLD holdings from the blockchain.",
        });
      }

      const { data: wallet, error } = await supabase
        .from("wallets")
        .insert({
          address: values.address,
          profile_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (onChainData) {
        await supabase
          .from("nft_holdings")
          .insert({
            wallet_id: wallet.id,
            project_name: 'BGLD',
            total_nfts: onChainData.total_nfts,
            micro_nfts: onChainData.micro_nfts,
            block_number: onChainData.block_number || 0,
            user_id: user.id,
            wallet_address: values.address
          });
      }

      toast({
        title: "Wallet added",
        description: "Your wallet has been successfully connected.",
      });
      
      form.reset();
      onWalletAdded();
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
        <CardTitle>Connect Wallet</CardTitle>
        <CardDescription>
          Add your wallet address to start managing your holdings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0x..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
