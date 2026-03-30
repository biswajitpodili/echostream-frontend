import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/context/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const useAuthGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [actionLabel, setActionLabel] = useState("This action");

  const ensureAuthenticated = (label = "This action") => {
    if (isAuthenticated) return true;

    setActionLabel(label);
    setOpen(true);
    return false;
  };

  const handleConfirmLogin = () => {
    setOpen(false);
    navigate("/login", {
      state: {
        from: `${location.pathname}${location.search}${location.hash}`,
      },
    });
  };

  const AuthPromptDialog = () => (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Login Required</AlertDialogTitle>
          <AlertDialogDescription>
            {actionLabel} is available only after login. Continue to login?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmLogin}>Login</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { ensureAuthenticated, AuthPromptDialog };
};
