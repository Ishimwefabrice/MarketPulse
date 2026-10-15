import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MarketPulse — Weekly intel for small businesses",
  description:
    "Competitive scan, price signals, and content drafts powered by Nebius Nemotron and Tavily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${manrope.variable}`}
        style={
          {
            "--font-display": "var(--font-syne), sans-serif",
            "--font-body": "var(--font-manrope), sans-serif",
          } as React.CSSProperties
        }
      >
        <main>
          <header className="site-header">
            <a className="brand" href="/">
              <span className="brand-mark" aria-hidden />
              MarketPulse
            </a>
            <a className="nav-link" href="/#onboard">
              Start a brief
            </a>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
