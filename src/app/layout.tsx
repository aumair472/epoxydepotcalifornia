import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SignInModal } from "@/components/auth/SignInModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { EvaChatWidget } from "@/components/chat/EvaChatWidget";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navbar } from "@/components/layout/Navbar";
import { SearchModal } from "@/components/search/SearchModal";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/context/Providers";
import { siteConfig } from "@/data/mockData";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `Epoxy Flooring Supplies, Floor Coatings & Contractor Tools | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#1A1A1D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <Providers>
          <a
            href="#main"
            className="sr-only z-[100] rounded-md bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <MobileMenu />
          <SearchModal />
          <SignInModal />
          <EvaChatWidget />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
