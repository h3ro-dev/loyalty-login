import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";

const walletSchema = z.object({
  address: z.string().min(42, "Invalid wallet address").max(42, "Invalid wallet address"),
});

type WalletFormValues = z.infer<typeof walletSchema>;

interface Wallet {
  id: string;
  address: string;
  tokenHoldings: TokenHolding[];
  nftHoldings: NFTHolding[];
}

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

export default function Wallets() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      address: "",
    },
  });

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
            tokenHoldings: tokenHoldings || [],
            nftHoldings: nftHoldings || [],
          };
        })
      );

      setWallets(walletsWithHoldings);
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

  const onSubmit = async (values: WalletFormValues) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("wallets")
        .insert({
          address: values.address,
          profile_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Wallet added",
        description: "Your wallet has been successfully connected.",
      });
      
      form.reset();
      fetchWallets();
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
              Manage your connected wallets and view their holdings
            </p>
          </div>
        </div>

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

        {wallets.length > 0 && (
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
                    <h3 className="text-lg font-semibold">{wallet.address}</h3>
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
        )}
      </div>
    </div>
  );
}
