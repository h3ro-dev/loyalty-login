
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWalletForm } from "@/hooks/use-wallet-form";

interface ConnectWalletCardProps {
  onWalletAdded: () => void;
}

export function ConnectWalletCard({ onWalletAdded }: ConnectWalletCardProps) {
  const { form, isLoading, onSubmit } = useWalletForm();

  const handleSubmit = async (values: any) => {
    const result = await onSubmit(values);
    if (result) {
      onWalletAdded();
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
