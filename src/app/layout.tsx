import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
