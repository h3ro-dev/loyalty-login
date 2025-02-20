
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bug, Check, Terminal, X, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  address: string;
  total_nfts: number;
  micro_nfts: number;
  pending_rewards: number;
  error?: string;
}

export default function BGLDTesting() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const testAddress = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log("Testing address:", address);
      const { data, error } = await supabase.functions.invoke('query-bgld-holdings', {
        body: { 
          address,
          blockNumber: 41745797 // Specific block number for snapshot
        }
      });

      if (error) throw error;

      console.log("Result:", data);
      setResult({
        address,
        ...data
      });
    } catch (error: any) {
      console.error("Error testing address:", error);
      setResult({
        address,
        total_nfts: 0,
        micro_nfts: 0,
        pending_rewards: 0,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">BGLD Holdings Test</h1>
          <p className="text-muted-foreground">
            Test wallet addresses against block 41745797 snapshot
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Address</CardTitle>
            <CardDescription>
              Enter an Ethereum address to test BGLD holdings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input 
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Button 
                onClick={testAddress} 
                disabled={isLoading || !address}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Bug className="mr-2 h-4 w-4" />
                    Test
                  </>
                )}
              </Button>
            </div>

            {result && (
              <div className="space-y-4">
                {result.error ? (
                  <Alert variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{result.error}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Results for {result.address}</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-1 font-mono text-sm">
                        <div>NFTs: {result.total_nfts}</div>
                        <div>Micro NFTs: {result.micro_nfts}</div>
                        <div>Pending Rewards: {result.pending_rewards}</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Debug Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-secondary p-4 rounded-lg text-sm overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
