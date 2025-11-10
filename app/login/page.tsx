// LoginPage.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Eye, EyeOff, Terminal } from "lucide-react";
import {
  navigateToRoleOrLogin, 
  getAccessToken,       
} from "@/lib/api/auth";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // ✅ Simplified onSubmit handler
  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      // 1. Log in
      await login(data.username, data.password);
      // 2. Just call the central navigation function. It does the rest.
      await navigateToRoleOrLogin(router);

    } catch (err: any) {
      // Your existing error handling is perfect
      if (err?.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const firstErrorKey = Object.keys(serverErrors)[0];
        setError(serverErrors[firstErrorKey][0]);
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    }
  };


  // ✅ Simplified useEffect to check auth status and redirect if needed
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const token = getAccessToken();

      if (!token) {
        // No token, stop loading and show the login page
        if (mounted) setCheckingAuth(false);
        return;
      }

      try {
        await navigateToRoleOrLogin(router);
        
      } catch (e) {
        
        if (mounted) setCheckingAuth(false);
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [router]);
  // We removed the second useEffect as this one now handles all logic.


  // Show a spinner while we check existing auth state
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // ... (Rest of your JSX is unchanged) ...
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left side: Branding/Image */}
      <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-2 text-center ">
        <div className="bg-gradient-to-b from-orange-600 to-yellow-200 w-full h-full flex items-center justify-center rounded-lg">
          <div className="max-w-md  ">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Bawa Medicals
            </h1>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="your_username"
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
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      {/* <a
                        href="#" // Replace with your forgot password link
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot password?
                      </a> */}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
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

          
        </div>
      </div>
    </div>
  );
}