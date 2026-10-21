import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Homecoming: your taste, in a new city", description: "Tell us what you loved back home. Homecoming finds what feels the same in your new city, and shows you why." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..600,100;1,9..144,300..600,100&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>);
}
