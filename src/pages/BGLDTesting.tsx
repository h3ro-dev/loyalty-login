
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestAddressForm } from "@/components/bgld/TestAddressForm";
import { TestResults } from "@/components/bgld/TestResults";
import { fetchBscKey, testBGLDAddress, type TestResult } from "@/services/bgld-service";

export default function BGLDTesting() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [bscKey, setBscKey] = useState<string | null>(null);

  useEffect(() => {
    const initBscKey = async () => {
      const key = await fetchBscKey();
      setBscKey(key);
    };
    initBscKey();
  }, []);

  const handleTest = async () => {
    if (!bscKey) return;
    
    setIsLoading(true);
    setResult(null);
    
    const testResult = await testBGLDAddress(address, bscKey);
    setResult(testResult);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">BGLD Holdings Test (BSC)</h1>
          <p className="text-muted-foreground">
            Test wallet addresses and store results in database
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Address</CardTitle>
            <CardDescription>
              Enter an address to test BGLD holdings on BSC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TestAddressForm 
              address={address}
              onAddressChange={setAddress}
              onTest={handleTest}
              isLoading={isLoading}
              bscKey={bscKey}
            />
            {result && <TestResults result={result} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
