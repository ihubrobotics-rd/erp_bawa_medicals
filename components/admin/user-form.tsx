// components/users/user-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUsers } from "@/hooks/useUsers"
import type { User, Role } from "@/types/medical"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

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
  })

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user: User | null
  roles: Role[]
  onClose: () => void
}

export function UserForm({ user, roles, onClose }: UserFormProps) {
  const isEditMode = !!user
  const { createUserMutation, updateUserMutation } = useUsers()
  const { toast } = useToast()
  const defaultRoleId = roles[0]?.id ?? 0

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
  })

  useEffect(() => {
    if (isEditMode) {
      reset({
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        is_active: user.is_active,
      })
    } else {
      reset({
        username: "",
        email: "",
        mobile: "",
        role: defaultRoleId,
        password: "",
        confirm_password: "",
        is_active: true,
      })
    }
  }, [user, isEditMode, reset, defaultRoleId])

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
        })
        toast({ title: "Success", description: "User updated successfully." })
      } else {
        // In create mode, we send all fields
        await createUserMutation.mutateAsync(data)
        toast({ title: "Success", description: "User created successfully." })
      }
      onClose()
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "An unexpected error occurred."
      toast({ variant: "destructive", title: "Error", description: errorMsg })
    }
  }

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the user details below." : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register("username")} disabled={isEditMode} />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input id="mobile" {...register("mobile")} />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
          </div>
          <div>
            <Label>Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>
          {!isEditMode && (
            <>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input id="confirm_password" type="password" {...register("confirm_password")} />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
                )}
              </div>
            </>
          )}
          {isEditMode && (
            <div className="flex items-center space-x-2">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="is_active">Active Status</Label>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}