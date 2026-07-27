import type { Metadata } from "next";
import {
  Geist,
  Fraunces,
  Dancing_Script,
  Instrument_Serif,
  Manrope,
  Inter,
} from "next/font/google";
import "./globals.css";
import OfferBar from "@/components/OfferBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const dancing = Dancing_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spirupop.com"),
  title: {
    default:
      "SpiruPop — The Science of Longevity. The Luxury of Pure Nutrition.",
    template: "%s · SpiruPop",
  },
  description:
    "12 bio-active botanicals. Two capsules daily. SpiruPop pairs pristine Indian Spirulina with targeted botanicals to restore hair, skin and nails from the cellular level. FSSAI compliant, 100% vegan HPMC, heavy-metal tested.",
  keywords: [
    "spirulina",
    "supplements",
    "hair growth",
    "skin radiance",
    "longevity",
    "superfood",
    "SpiruPop",
    "biotin",
    "vegan supplements",
  ],
  icons: { icon: "/icon.jpg" },
  openGraph: {
    title: "SpiruPop — The Science of Longevity",
    description:
      "12 bio-active botanicals. Two capsules daily. Restore hair, skin & nails from the cellular level.",
    url: "https://spirupop.com",
    siteName: "SpiruPop",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} ${dancing.variable} ${instrumentSerif.variable} ${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        <OfferBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
