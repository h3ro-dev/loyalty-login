
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
        <p className="mb-2">
          US Citizens Notice: You are subject to Expanded Due Diligence (EDD) and may be subject to additional reporting requirements.
        </p>
        <p className="text-sm text-muted-foreground mt-4 border-t border-destructive/20 pt-3">
          <strong>Additional Verification Notice:</strong> If additional information is needed to validate your wallet, you will be contacted. Required information for further verification may include, but is not limited to: Primary Residential Address, Phone Number, Date of Purchase of particular NFTs, Method of Purchase, and Sales Channel (how you came to purchase your NFTs).
        </p>
      </AlertDescription>
    </Alert>
  );
};
