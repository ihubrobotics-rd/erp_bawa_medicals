"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useGlobalBack() {
    const router = useRouter();

    const handleBack = useCallback(() => {
        try {

            const roleName = localStorage.getItem("role_name");

            if (!roleName) {
                router.push("/login"); // fallback if not logged in
                return;
            }
            const normalizedRole = roleName.toLowerCase().replace(/\s+/g, "");
            const homePath = `/${normalizedRole}`;
            router.push(homePath);
        } catch (error) {
            console.error("Error while handling global back:", error);
            router.push("/"); // fallback
        }
    }, [router]);

    return { handleBack };
}
