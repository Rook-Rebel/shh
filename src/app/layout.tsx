import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import AmbientBackground from "@/components/AmbientBackground";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://shh.ge";
const tagline = "just between us 🤏";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "shh.",
    template: "%s",
  },
  description: tagline,
  openGraph: {
    title: "shh.",
    description: tagline,
    url: siteUrl,
    siteName: "shh.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "shh.",
    description: tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="relative flex min-h-full flex-col bg-[#08080b] font-sans text-ink antialiased">
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
