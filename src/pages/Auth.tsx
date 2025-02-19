
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedBackground } from "@/components/auth/AnimatedBackground";
import { AuthForm } from "@/components/auth/AuthForm";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (values: { email: string; password: string }, isSignUp: boolean) => {
    setIsLoading(true);
    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
        : await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });

      if (error) {
        if (
          error.message.includes("User already registered") ||
          error.message.includes("already exists")
        ) {
          toast({
            title: "Account already exists",
            description: "Please sign in instead.",
          });
          setActiveTab("signin");
          return;
        }
        throw error;
      }

      if (isSignUp) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-card/80 animate-fadeIn">
        <CardHeader className="space-y-4">
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Largest Rewards Giveaway in History
            </CardTitle>
            <CardDescription className="text-xl font-semibold text-primary">
              Enter Now to Claim Your Stake
            </CardDescription>
          </div>
          <CardDescription className="text-center">
            Sign in or create an account to manage your holdings and participate in the giveaway
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <AuthForm
                onSubmit={(values) => handleSubmit(values, false)}
                isLoading={isLoading}
                type="signin"
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <AuthForm
                onSubmit={(values) => handleSubmit(values, true)}
                isLoading={isLoading}
                type="signup"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
