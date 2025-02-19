
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const LegalDisclaimer = () => {
  return (
    <Alert variant="destructive" className="mb-6 animate-fadeIn">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-medium">Important Legal Notice</AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        <p className="mb-2">
          The Chrysalis RWA platform requires KYC lite verification (Name, Email & Wallet Address at minimum). 
          All submissions are subject to independent review and verification.
        </p>
        <p className="mb-2">
          <strong>Warning:</strong> Falsification of KYC information will be reported to proper authorities.
        </p>
        <p className="font-semibold">
          US Citizens Notice: You are subject to Expanded Due Diligence (EDD) and may be subject to additional reporting requirements.
        </p>
      </AlertDescription>
    </Alert>
  );
};
