import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { CallFab } from "@/components/call/CallFab";
import { PrintImageLoader } from "@/components/layout/PrintImageLoader";
import { CallToOrderModal } from "@/components/call/CallToOrderModal";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Navbar } from "@/components/layout/Navbar";
import { SearchModal } from "@/components/search/SearchModal";
import { GoogleTagManager } from "@/components/seo/GoogleTagManager";
import { JsonLd } from "@/components/seo/JsonLd";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/context/Providers";
import { siteConfig } from "@/data/mockData";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Epoxy Flooring Supplies & Floor Coatings | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: "./",
    images: [{ url: "/logo.png", alt: siteConfig.name }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <GoogleTagManager gtmId={siteConfig.gtmId} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Providers>
          <a
            href="#main"
            className="sr-only z-[100] rounded-md bg-brand-deep px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileMenu />
          <SearchModal />
          <CallToOrderModal />
          <CallFab />
          <Toaster />
          <PrintImageLoader />
        </Providers>
      </body>
    </html>
  );
}
