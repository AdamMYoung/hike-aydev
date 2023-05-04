import { Map, Toaster } from "ui";
import { SideNavigation, TopNavigation } from "@templates/index";
import { Jost } from "next/font/google";

import "../styles/globals.css";

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
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
