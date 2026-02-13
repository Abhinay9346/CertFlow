"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Award,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const dashboardPath =
    user?.role === "hod"
      ? "/dashboard/hod"
      : user?.role === "principal"
        ? "/dashboard/principal"
        : "/dashboard/student";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Award className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">CertFlow</span>
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <Link href={dashboardPath}>
              <Button variant="ghost" size="sm" className="text-foreground">
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight text-foreground">
                  {user.name}
                </span>
                <span className="text-xs capitalize leading-tight text-muted-foreground">
                  {user.role}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
