// components/users/user-detail-modal.tsx
"use client"

import { useUser } from "@/hooks/useUsers"
import type { Role } from "@/types/medical"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface UserDetailModalProps {
  userId: number
  roles: Role[]
  onClose: () => void
}

export function UserDetailModal({ userId, roles, onClose }: UserDetailModalProps) {
  const { data: user, isLoading, isError } = useUser(userId)

  const getRoleName = (roleId: number) => {
    return roles.find((r) => r.id === roleId)?.name || "Unknown Role"
  }

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4 py-2">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm">{value}</span>
    </div>
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Viewing the complete profile of the selected user.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {isError && <p className="text-red-500 py-4">Failed to load user details.</p>}

        {user && (
          <div className="py-4">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <DetailRow label="ID" value={`USER-${user.id}`} />
            <DetailRow label="Mobile" value={user.mobile} />
            <DetailRow
              label="Role"
              value={<Badge variant="secondary">{getRoleName(user.role)}</Badge>}
            />
            <DetailRow
              label="Status"
              value={
                <Badge variant={user.is_active ? "default" : "destructive"}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              }
            />
            <DetailRow
              label="Joined On"
              value={
                user.created_at
                  ? new Date(user.created_at).toLocaleString("en-IN", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })
                  : "N/A"
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}