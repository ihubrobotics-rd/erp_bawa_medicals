// app/(protected)/[...slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { usePrivileges } from "@/providers/PrivilegeProvider";
import { toSlug } from "@/lib/utils";

import AccessDenied from "@/components/shared/AccessDenied";
import TaxPage from "@/components/modules/file/TaxPage";
// ... import other page components as you create them:
// import BankPage from "@/components/modules/file/BankPage";

const componentMap: { [key: string]: React.ComponentType<any> } = {
  "file/tax": TaxPage,
  // "file/bank": BankPage,
};

export default function DynamicPage() {
  const params = useParams();
  const { privileges, isLoading } = usePrivileges();
  const slug = params.slug as string[];

  if (isLoading) {
    return <div className="text-center p-8">Loading & Verifying Access...</div>;
  }

  const [moduleSlug, submoduleSlug, functionalitySlug] = slug;

  let privilegeCheck;
  let componentKey = slug.join('/');

  if (functionalitySlug) {
    privilegeCheck = privileges?.functionalities?.find(
      (p: any) => toSlug(p.module_name) === moduleSlug && toSlug(p.submodule_name) === submoduleSlug && toSlug(p.functionality_name) === functionalitySlug
    );
  } else if (submoduleSlug) {
    privilegeCheck = privileges?.submodules?.results?.find(
      (p: any) => toSlug(p.module_name) === moduleSlug && toSlug(p.submodule_name) === submoduleSlug
    );
  } else {
    privilegeCheck = privileges?.modules?.results?.find(
      (p: any) => toSlug(p.module_name) === moduleSlug
    );
  }

  if (!privilegeCheck || !privilegeCheck.can_view) {
    return <AccessDenied />;
  }

  const PageComponent = componentMap[componentKey];

  if (!PageComponent) {
    return <div className="text-center p-8">404 - Page Component Not Found. Please configure it in the `componentMap` of your dynamic page router.</div>;
  }

  return <PageComponent privileges={privilegeCheck} />;
}