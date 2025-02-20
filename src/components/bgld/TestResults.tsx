
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Terminal, X } from "lucide-react";

interface TestResult {
  address: string;
  total_nfts: number;
  micro_nfts: number;
  pending_rewards: number;
  error?: string;
}

interface TestResultsProps {
  result: TestResult;
}

export function TestResults({ result }: TestResultsProps) {
  if (!result) return null;

  return (
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
  );
}
