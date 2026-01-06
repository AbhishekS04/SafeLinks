
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import clsx from "clsx";
import { SearchOverlay } from "@/components/features/SearchOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SafeLinks",
  description: "A quiet place for your links.",
};

import { UiProvider } from "@/components/providers/UiProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#78716c" },
        layout: { socialButtonsPlacement: "bottom", socialButtonsVariant: "iconButton" }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={clsx(
            inter.variable,
            playfair.variable,
            "antialiased min-h-screen flex flex-col items-center bg-background text-foreground"
          )}
        >
          <UiProvider>
            <SearchOverlay />
            <main className="w-full max-w-2xl px-6 py-12 flex-1 flex flex-col">
              {children}
            </main>
          </UiProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
