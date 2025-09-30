"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
  getAccessToken,
  isTokenExpired,
  refreshAccessToken,
  getRoleName,
} from "@/lib/api/auth";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      const user = await login(data.username, data.password); // ✅ Pass both

      // ✅ Role-based navigation
      // Use replace so user can't go back to login via browser back
      switch (user.role_name) {
        case "Super admin":
          router.replace("/super-admin");
          break;
        case "Admin":
          router.replace("/admin");
          break;
        default:
          router.replace("/dashboard");
      }
    } catch (err: any) {
      // Show backend errors (if available)
      if (err?.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const firstErrorKey = Object.keys(serverErrors)[0];
        setError(serverErrors[firstErrorKey][0]); // show first backend error
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    }
  };

  // If already authenticated, redirect away from login immediately
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const token = getAccessToken();
      if (!token) return;

      if (isTokenExpired(token)) {
        try {
          await refreshAccessToken();
        } catch (e) {
          return; // failed to refresh -> stay on login
        }
      }

      // If refreshed/valid, redirect based on stored role
      if (!mounted) return;
      const role = getRoleName();
      if (role === "Super admin") router.replace("/super-admin");
      else if (role === "Admin") router.replace("/admin");
      else router.replace("/dashboard");
    };

    check();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ERP System</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
