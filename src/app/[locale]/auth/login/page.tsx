"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push(`/${locale}/admin`);
      router.refresh();
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center section-padding bg-background">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="text-center mb-10">
            <span className="luxury-heading text-2xl tracking-[0.3em] uppercase text-foreground">
              ZIZI<span className="gold-text">WATCHES</span>
            </span>
            <div className="w-8 h-px bg-gold mx-auto mt-4 mb-6 opacity-50" />
            <h1 className="text-foreground/70 text-sm tracking-widest uppercase">
              {t("login")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full mt-2 disabled:opacity-60"
            >
              {loading ? "..." : t("loginBtn")}
            </button>
          </form>

        </div>
      </main>
    </>
  );
}
