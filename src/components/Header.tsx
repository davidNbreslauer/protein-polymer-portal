
import { Database, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

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
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
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
      if (error) throw error;
      toast({
        title: "Successfully signed up",
        description: "Please check your email to verify your account",
      });
      setShowLogin(false);
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
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Protein Polymer Research Database</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!showLogin ? (
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowLogin(true)}
                disabled={isLoading}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            ) : (
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSignIn}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSignUp}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1"
                    >
                      Sign Up
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowLogin(false)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Explore engineered protein polymers and their applications
        </p>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by protein name, application, or properties..."
            className={cn(
              "w-full px-4 py-2.5 rounded-lg",
              "bg-gray-50 border border-gray-200",
              "placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition duration-200"
            )}
          />
        </div>
      </div>
    </header>
  );
};
