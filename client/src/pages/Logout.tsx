import { useEffect } from "react";
import { useLocation } from "wouter";
import { useLogout } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Logout() {
  const [, setLocation] = useLocation();
  const { mutate: logout } = useLogout();
  const { toast } = useToast();

  useEffect(() => {
    logout(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account."
        });
        setLocation("/");
      },
      onError: (err) => {
        toast({
          title: "Logout failed",
          description: err.message,
          variant: "destructive"
        });
        setLocation("/");
      },
    });
  }, [logout, setLocation, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Logging out...</h2>
        <p className="text-slate-500">Please wait while we log you out.</p>
      </div>
    </div>
  );
}