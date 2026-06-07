"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { IS_DEMO } from "@/lib/firebase";
import { auth } from "@/lib/firebase-client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLoading from "@/components/admin/AdminLoading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    if (IS_DEMO) {
      const ok = sessionStorage.getItem("admin_demo") === "true";
      if (!ok) {
        router.replace("/admin/login");
      } else {
        setAuthed(true);
      }
      setChecking(false);
      return;
    }

    if (!auth) {
      router.replace("/admin/login");
      setChecking(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthed(true);
      } else {
        router.replace("/admin/login");
      }
      setChecking(false);
    });

    return () => unsub();
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (checking) {
    return (
      <div className="admin-auth-loading">
        <AdminLoading />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-content">{children}</div>
    </div>
  );
}
