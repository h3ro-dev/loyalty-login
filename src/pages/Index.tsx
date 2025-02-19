
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { ProjectTransitions } from "@/components/ProjectTransitions";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

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
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Important Announcement
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient">
              Largest Loyalty Giveaway in Crypto History
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chrysalis is extending an invitation to previous holders to participate in the new and largest RWA platform on the planet.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Time Sensitive</span>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient">
              Secure Your Place in Line
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit your information now. Applications are processed based on submission date and holdings size.
            </p>
          </div>
          
          <LegalDisclaimer />
          
          {!isAuthenticated ? (
            <div className="text-center space-y-4 animate-fadeIn">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient hover:opacity-90 transition-opacity">
                  Sign In or Create Account
                </Button>
              </Link>
              <div>
                <Link to="/wallets">
                  <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/10">
                    Connect Wallet
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-gradient">Project Transitions</h2>
                <p className="text-muted-foreground">
                  Explore how our projects are evolving in the new ecosystem
                </p>
              </div>
              <ProjectTransitions />
              <div className="text-center mt-8">
                <Link to="/wallets">
                  <Button size="lg" className="bg-gradient hover:opacity-90 transition-opacity">
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
