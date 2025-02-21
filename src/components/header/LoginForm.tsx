
import { Button } from "../ui/button";

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onCancel: () => void;
}

export const LoginForm = ({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onSignUp,
  onCancel,
}: LoginFormProps) => {
  return (
    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
      <div className="space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onSignIn}
            disabled={isLoading}
            className="flex-1"
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={onSignUp}
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
          onClick={onCancel}
          disabled={isLoading}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
