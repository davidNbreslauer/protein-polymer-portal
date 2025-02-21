
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { Session } from "@supabase/supabase-js";

interface AuthButtonsProps {
  session: Session | null;
  isLoading: boolean;
  showLogin: boolean;
  onShowLoginClick: () => void;
  onSignOut: () => void;
}

export const AuthButtons = ({
  session,
  isLoading,
  showLogin,
  onShowLoginClick,
  onSignOut,
}: AuthButtonsProps) => {
  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="text-sm text-gray-600">{session.user.email}</span>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onSignOut}
          disabled={isLoading}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  if (!showLogin) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={onShowLoginClick}
        disabled={isLoading}
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  return null;
};
