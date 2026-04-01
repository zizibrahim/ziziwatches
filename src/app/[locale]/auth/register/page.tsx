"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Header from "@/components/layout/Header";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'inscription.");
      setLoading(false);
      return;
    }

    // Auto login after register
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 flex items-center justify-center section-padding">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <span className="luxury-heading text-2xl tracking-[0.3em] uppercase text-foreground">
              ZIZI<span className="gold-text">WATCHES</span>
            </span>
            <div className="w-8 h-px bg-gold mx-auto mt-4 mb-6 opacity-50" />
            <h1 className="text-foreground/70 text-sm tracking-widest uppercase">
              {t("register")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: t("name"), type: "text", placeholder: "Votre nom complet" },
              { key: "email", label: t("email"), type: "email", placeholder: "votre@email.com" },
              { key: "password", label: t("password"), type: "password", placeholder: "8 caractères min." },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  minLength={key === "password" ? 8 : 2}
                  className="w-full bg-surface border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder={placeholder}
                />
              </div>
            ))}

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full mt-2 disabled:opacity-60"
            >
              {loading ? "..." : t("registerBtn")}
            </button>
          </form>

          <p className="text-center text-foreground/40 text-xs mt-6">
            {t("hasAccount")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="text-gold hover:text-gold-light transition-colors"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
