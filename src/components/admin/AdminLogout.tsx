"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminLogout({ locale }: { locale: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `/${locale}/auth/login` })}
      className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400/60 hover:text-red-400 transition-colors"
    >
      <LogOut size={14} />
      Déconnexion
    </button>
  );
}
