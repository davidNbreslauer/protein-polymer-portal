
import { BarChart2, Database, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
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
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Protein Polymer Research Database</h1>
            </div>
            <Link
              to="/stats"
              className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-sm">Stats</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm text-gray-600">{session.user.email}</span>
                </div>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              !showLogin ? (
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
                      onClick={() => {
                        setShowLogin(false);
                        setEmail("");
                        setPassword("");
                      }}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )
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
