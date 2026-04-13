import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import ChatWidget from "@/components/ai/ChatWidget";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import PageTransition from "@/components/layout/PageTransition";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ziziwatches — L'Art du Temps",
    template: "%s | Ziziwatches",
  },
  description: "Montres de luxe pour ceux qui savent que chaque seconde compte.",
  keywords: ["montres", "luxe", "watches", "Algeria", "Ziziwatches"],
  openGraph: {
    type: "website",
    siteName: "Ziziwatches",
    locale: "fr_DZ",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();

  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${inter.variable} ${cormorant.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div className="grain" aria-hidden="true" />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <PageTransition>{children}</PageTransition>
            <ChatWidget />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
