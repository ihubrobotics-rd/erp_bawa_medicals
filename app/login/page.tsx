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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { navigateToRoleOrLogin, getAccessToken } from "@/lib/api/auth";
import Image from "next/image";

import Background from "../../public/images/Background.png";

export default function LoginPage() {
    const [error, setError] = useState<string>("");
    const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberDevice, setRememberDevice] = useState<boolean>(true);
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError("");
            await login(data.username, data.password);
            await navigateToRoleOrLogin(router);
        } catch (err: any) {
            if (err?.response?.data?.errors) {
                const serverErrors = err.response.data.errors;
                const firstErrorKey = Object.keys(serverErrors)[0];
                setError(serverErrors[firstErrorKey][0]);
            } else {
                setError(err instanceof Error ? err.message : "Login failed");
            }
        }
    };

    useEffect(() => {
        let mounted = true;

        const check = async () => {
            const token = getAccessToken();

            if (!token) {
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

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Checking authentication...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding/Image */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Background Image */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Image
                        src={Background}
                        alt="Pharmacy Background"
                        className="w-4/5 h-4/5 object-contain"
                        priority
                    />
                </div>

                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    {/* Header */}
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xl">
                                B
                            </span>
                        </div>
                        <span className="text-2xl font-semibold">
                            Bawa Medicals
                        </span>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-lg mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Bawaa Medicals
                        </h1>
                        <p className="text-blue-100 text-xl leading-relaxed">
                            Leading pharmacy in Ramnad providing quality
                            prescription drugs and OTC products with trusted
                            healthcare solutions.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4 text-sm text-blue-200 justify-center">
                            <span>© 2025 Bawa Medicals</span>
                            <span>•</span>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Privacy
                            </a>
                            <span>•</span>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Terms
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mb-40"></div>
                <div className="absolute top-0 left-0 w-60 h-60 bg-white/5 rounded-full -ml-30 -mt-30"></div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-12 bg-white">
                <div className="mx-auto w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-10 text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">
                                    B
                                </span>
                            </div>
                            <span className="text-3xl font-semibold text-gray-900">
                                Bawa Medicals
                            </span>
                        </div>
                    </div>

                    {/* Form Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Sign in to your account
                        </h2>
                        <p className="text-gray-600">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    {/* Login Card */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-8">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    {/* Email Field */}
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                        <Input
                                                            type="name"
                                                            placeholder="Enter Name"
                                                            className="pl-11 h-12 text-base"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Password Field */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                        <Input
                                                            type={
                                                                showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            placeholder="Enter Password"
                                                            className="pl-11 pr-11 h-12 text-base"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    (prev) =>
                                                                        !prev
                                                                )
                                                            }
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                            <span className="sr-only">
                                                                {showPassword
                                                                    ? "Hide password"
                                                                    : "Show password"}
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                <div className="flex justify-end mt-2">
                                                    <a
                                                        href="#"
                                                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                                    >
                                                        Forgot password?
                                                    </a>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberDevice}
                                            onCheckedChange={(checked) =>
                                                setRememberDevice(
                                                    checked === true
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="text-sm font-medium leading-none text-gray-700 cursor-pointer"
                                        >
                                            Remember this device
                                        </label>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <Alert
                                            variant="destructive"
                                            className="mt-4"
                                        >
                                            <AlertDescription className="text-sm capitalize">
                                                {error}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <ArrowRight className="mr-3 h-5 w-5" />
                                                Continue
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Mobile Footer */}
                    <div className="mt-10 text-center lg:hidden">
                        <div className="flex justify-center space-x-6 text-sm text-gray-500 mb-4">
                            <a
                                href="#"
                                className="hover:text-gray-700 font-medium"
                            >
                                Terms
                            </a>
                            <a
                                href="#"
                                className="hover:text-gray-700 font-medium"
                            >
                                Privacy
                            </a>
                            <a
                                href="#"
                                className="hover:text-gray-700 font-medium"
                            >
                                Help Center
                            </a>
                        </div>
                        <p className="text-sm text-gray-500">
                            © 2025 Bawa Medicals. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
