"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, ChevronDown, Mail, Phone, MapPin } from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-gold"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-foreground/50 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactClient({ faqs }: { faqs: Faq[] }) {
  const t = useTranslations("contact");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("required");
    if (!form.email.trim()) e.email = t("required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("invalidEmail");
    if (!form.message.trim()) e.message = t("required");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => { const n = { ...p }; delete n[e.target.name]; return n; });
  }

  const fieldClass = (key: string) =>
    `w-full bg-transparent border-b ${
      errors[key] ? "border-red-500/60" : "border-border/40"
    } text-foreground text-sm px-0 py-3 placeholder:text-foreground/25 focus:outline-none focus:border-gold transition-colors`;

  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* ── Hero band ── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          {/* decorative gold lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" style={{ left: "8%" }} />
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" style={{ left: "92%" }} />
          </div>

          <div className="section-padding text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-medium"
            >
              Ziziwatches
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="luxury-heading text-5xl md:text-6xl font-light tracking-[0.08em] uppercase text-black dark:text-foreground mb-6"
            >
              {t("title")}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-16 h-px bg-gold mx-auto mb-6"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-foreground/40 text-sm max-w-sm mx-auto leading-relaxed tracking-wide"
            >
              {t("subtitle")}
            </motion.p>
          </div>
        </section>

        {/* ── Main grid ── */}
        <section id="contact-form" className="section-padding pb-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left — info cards */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-3"
            >
              {[
                {
                  icon: Mail,
                  label: t("infoEmail"),
                  value: "asmaezouggari321@gmail.com",
                  href: "mailto:asmaezouggari321@gmail.com",
                },
                {
                  icon: Phone,
                  label: t("infoPhone"),
                  value: "+212 6XX XXX XXX",
                  href: "tel:+2126XXXXXXXX",
                },
                {
                  icon: MapPin,
                  label: t("infoLocation"),
                  value: "Maroc",
                  href: "https://maps.google.com/?q=Maroc",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 px-4 py-3 border border-border/40 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                >
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-gold/60 group-hover:text-gold transition-colors" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 mb-0.5">
                      {label}
                    </p>
                    <p className="text-xs text-foreground/50 group-hover:text-foreground/80 transition-colors truncate">
                      {value}
                    </p>
                  </div>
                </a>
              ))}

            </motion.aside>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-6 py-20 text-center border border-gold/20 bg-gold/5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    >
                      <CheckCircle size={52} className="text-gold" strokeWidth={1} />
                    </motion.div>
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">
                        {t("successTitle")}
                      </p>
                      <p className="text-foreground/50 text-sm leading-relaxed max-w-xs">
                        {t("success")}
                      </p>
                    </div>
                    <button
                      onClick={() => { setStatus("idle"); setForm({ name: "", email: "", message: "" }); }}
                      className="text-xs tracking-[0.2em] uppercase text-foreground/30 hover:text-gold transition-colors border-b border-current pb-0.5"
                    >
                      {t("sendAnother")}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-8"
                  >
                    {/* name */}
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black dark:text-foreground/70 mb-1">
                        {t("name")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t("namePlaceholder")}
                        className={fieldClass("name")}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-[11px] text-red-400">{errors.name}</p>
                      )}
                    </div>

                    {/* email */}
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black dark:text-foreground/70 mb-1">
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t("emailPlaceholder")}
                        className={fieldClass("email")}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-[11px] text-red-400">{errors.email}</p>
                      )}
                    </div>

                    {/* message */}
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black dark:text-foreground/70 mb-1">
                        {t("message")}
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder={t("messagePlaceholder")}
                        className={fieldClass("message") + " resize-none"}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-[11px] text-red-400">{errors.message}</p>
                      )}
                    </div>

                    {status === "error" && (
                      <p className="text-xs text-red-400">{t("error")}</p>
                    )}

                    {/* submit */}
                    <div className="flex items-center gap-6">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group relative flex items-center gap-3 bg-gold text-obsidian text-[11px] tracking-[0.3em] uppercase font-semibold px-8 py-4 hover:bg-gold/90 transition-colors disabled:opacity-60 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {status === "sending" ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-3.5 h-3.5 border border-obsidian/40 border-t-obsidian rounded-full"
                              />
                              {t("sending")}
                            </>
                          ) : (
                            <>
                              <Send size={13} />
                              {t("send")}
                            </>
                          )}
                        </span>
                      </button>
                      <p className="text-[10px] text-foreground/20 tracking-wider uppercase hidden sm:block">
                        {t("responseTime")}
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ section ── */}
        {faqs.length > 0 && (
          <section className="section-padding pb-28">
            <div className="max-w-2xl mx-auto">
              {/* section header */}
              <div className="text-center mb-14">
                <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-medium">
                  {t("faqTagline")}
                </p>
                <h2 className="luxury-heading text-3xl md:text-4xl font-light tracking-[0.08em] uppercase text-foreground mb-4">
                  {t("faqTitle")}
                </h2>
                <div className="w-10 h-px bg-gold mx-auto" />
              </div>

              <div className="border-t border-border/30">
                {faqs.map((faq) => (
                  <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                ))}
              </div>


            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
