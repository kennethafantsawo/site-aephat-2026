"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const locale = pathname.split("/")[1] || "fr";

    fetch("/api/admin/auth", { method: "GET" })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          setAuthorized(true);
        } else {
          router.replace(`/${locale}/admin/login`);
        }
        setChecking(false);
      })
      .catch(() => {
        router.replace(`/${locale}/admin/login`);
        setChecking(false);
      });
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Chargement...</div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
