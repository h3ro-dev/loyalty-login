
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { ProjectTransitions } from "@/components/ProjectTransitions";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Chrysalis Migration</h1>
            <p className="text-muted-foreground">
              Welcome to the future of digital asset management
            </p>
          </div>
          
          <LegalDisclaimer />
          
          {!isAuthenticated ? (
            <div className="text-center space-y-4 animate-fade-in">
              <Link to="/auth">
                <Button size="lg">
                  Sign In or Create Account
                </Button>
              </Link>
              <div>
                <Link to="/wallets">
                  <Button variant="outline" size="lg">
                    Connect Wallet
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Project Transitions</h2>
                <p className="text-muted-foreground">
                  Explore how our projects are evolving in the new ecosystem
                </p>
              </div>
              <ProjectTransitions />
              <div className="text-center mt-8">
                <Link to="/wallets">
                  <Button size="lg">
                    Manage Your Wallets
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
