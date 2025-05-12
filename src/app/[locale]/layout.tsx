import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { USERNAME_SHORT } from "@/const";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("homeTitle", {
      username: USERNAME_SHORT,
    }),
    description: t("homeDescription", {
      username: USERNAME_SHORT,
    }),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata" });

  if (!process.env.NEXT_PUBLIC_GA_ID) {
    throw new Error("GA ID is not set");
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="apple-mobile-web-app-title"
          content={t("homeTitle", {
            username: USERNAME_SHORT,
          })}
        />
      </head>

      <body
        className={`${inter.variable} ${jetBrainsMono.variable} min-h-svh bg-background`}
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-svh flex-col bg-background">
              <Header />

              <main className="flex w-full flex-col flex-1 items-center">
                {children}
              </main>

              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  );
}
