import "../styles/globals.css";

import { Jost } from "next/font/google";
import { Toaster } from "ui";

import { Analytics } from "@vercel/analytics/react";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
  title: "AYDev | Hike",
  description: "Track and manage your hiking achievements, across the UK and worldwide.",
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className={jost.variable}>
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className="font-sans">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
