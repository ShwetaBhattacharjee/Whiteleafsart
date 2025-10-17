import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WhiteLeafs Art - Digital Art Portfolio",
  description: "Explore and purchase high-resolution digital artwork by Shweta at WhiteLeafs Art. Instant downloads, secure payments via Stripe, and a collection inspired by nature and emotions.",
  keywords: "digital art, art portfolio, WhiteLeafs Art, Shweta, instant download, digital downloads, art for sale, aesthetic art",
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon.ico in your public directory
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}