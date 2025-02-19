
import { Link } from "react-router-dom";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Chrysalis Registration</h1>
            <p className="text-muted-foreground">
              Register to manage your wallet holdings and participate in the ecosystem migration.
            </p>
          </div>
          
          <LegalDisclaimer />
          
          <div className="text-center">
            <Link to="/auth">
              <Button size="lg">
                Sign In or Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
