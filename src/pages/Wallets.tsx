
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const walletSchema = z.object({
  address: z.string().min(42, "Invalid wallet address").max(42, "Invalid wallet address"),
});

type WalletFormValues = z.infer<typeof walletSchema>;

export default function Wallets() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      address: "",
    },
  });

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
      <div className="container max-w-2xl py-8">
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
      </div>
    </div>
  );
}
