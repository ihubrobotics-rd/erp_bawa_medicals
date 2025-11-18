// components/users/user-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUsers } from "@/hooks/useUsers";
import type { User, Role } from "@/types/medical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Zod schema for validation
const userSchema = z
    .object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Invalid email address"),
        mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
        role: z.coerce.number({ invalid_type_error: "Please select a role" }),
        password: z.string().optional(),
        confirm_password: z.string().optional(),
        is_active: z.boolean(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"], // path of error
    });

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
    user: User | null;
    roles: Role[];
    onClose: () => void;
}

export function UserForm({ user, roles, onClose }: UserFormProps) {
    const isEditMode = !!user;
    const { createUserMutation, updateUserMutation } = useUsers();
    const { toast } = useToast();
    const defaultRoleId = roles[0]?.id ?? 0;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            email: "",
            mobile: "",
            role: defaultRoleId,
            password: "",
            confirm_password: "",
            is_active: true,
        },
    });

    useEffect(() => {
        if (isEditMode) {
            reset({
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                is_active: user.is_active,
            });
        } else {
            reset({
                username: "",
                email: "",
                mobile: "",
                role: defaultRoleId,
                password: "",
                confirm_password: "",
                is_active: true,
            });
        }
    }, [user, isEditMode, reset, defaultRoleId]);

    const onSubmit = async (data: UserFormData) => {
        try {
            if (isEditMode) {
                // In edit mode, we don't send username or password
                await updateUserMutation.mutateAsync({
                    id: user.id,
                    data: {
                        email: data.email,
                        mobile: data.mobile,
                        role: data.role,
                        is_active: data.is_active,
                    },
                });
                toast({
                    title: "Success",
                    description: "User updated successfully.",
                });
            } else {
                // In create mode, we send all fields
                await createUserMutation.mutateAsync(data);
                toast({
                    title: "Success",
                    description: "User created successfully.",
                });
            }
            onClose();
        } catch (error: any) {
            const errorMsg =
                error.response?.data?.detail || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMsg,
            });
        }
    };

    const isLoading =
        createUserMutation.isPending || updateUserMutation.isPending;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="sr-only">
                        {isEditMode ? "Edit User" : "Add New User"}
                    </DialogTitle>
                    <DialogDescription className="text-lg font-semibold text-gray-900">
                        {isEditMode ? "Edit User" : "Add New User"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Your form fields remain the same */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="username"
                            className="text-sm font-medium text-gray-700"
                        >
                            Username
                        </Label>
                        <Input
                            id="username"
                            {...register("username")}
                            disabled={isEditMode}
                            className="w-full"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* ... other form fields ... */}

                    <DialogFooter className="pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 sm:flex-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
