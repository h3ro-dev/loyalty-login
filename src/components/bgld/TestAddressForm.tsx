
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bug, Loader, X } from "lucide-react";

interface TestAddressFormProps {
  address: string;
  onAddressChange: (address: string) => void;
  onTest: () => void;
  isLoading: boolean;
  bscKey: string | null;
}

export function TestAddressForm({
  address,
  onAddressChange,
  onTest,
  isLoading,
  bscKey
}: TestAddressFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input 
          placeholder="0x..."
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
        <Button 
          onClick={onTest} 
          disabled={isLoading || !address || !bscKey}
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

      {!bscKey && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertTitle>API Key Missing</AlertTitle>
          <AlertDescription>
            Please make sure your BSC API key is properly set in Supabase.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
