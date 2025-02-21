
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { Logo } from "./header/Logo";
import { SearchBar } from "./header/SearchBar";
import { AuthButtons } from "./header/AuthButtons";
import { LoginForm } from "./header/LoginForm";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Successfully signed in",
      });
      setShowLogin(false);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account already exists",
            description: "Please sign in instead.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
      
      toast({
        title: "Successfully signed up",
        description: "Please check your email to verify your account",
      });
      setShowLogin(false);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Successfully signed out",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            {showLogin ? (
              <LoginForm
                email={email}
                password={password}
                isLoading={isLoading}
                onEmailChange={(e) => setEmail(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                onCancel={() => {
                  setShowLogin(false);
                  setEmail("");
                  setPassword("");
                }}
              />
            ) : (
              <AuthButtons
                session={session}
                isLoading={isLoading}
                showLogin={showLogin}
                onShowLoginClick={() => setShowLogin(true)}
                onSignOut={handleSignOut}
              />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Explore engineered protein polymers and their applications
        </p>
        
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>
    </header>
  );
};
