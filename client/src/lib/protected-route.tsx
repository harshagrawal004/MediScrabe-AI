import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType;
  path?: string;
}

export function ProtectedRoute({ component: Component, path }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [initialCheck, setInitialCheck] = useState(false);

  useEffect(() => {
    if (!loading) {
      setInitialCheck(true);
      if (!user && location !== '/auth') {
        setLocation("/auth");
      }
    }
  }, [user, loading, setLocation, location]);

  // Show loading state only on initial load
  if (loading && !initialCheck) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, return null (the useEffect will handle redirect)
  if (!user) {
    return null;
  }

  // If authenticated, render the protected component
  return <Component />;
}
