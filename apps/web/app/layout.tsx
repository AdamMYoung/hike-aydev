import { SideNavigation, TopNavigation } from "@/templates";
import { Jost } from "next/font/google";
import { cn } from "ui";
import "../styles/globals.css";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

type LayoutProps = {
  children: React.ReactNode;
  navigation: React.ReactNode;
};

export const metadata = {
  title: "AYDev | Hike",
  description: "Track and manage your hiking achievements, across the UK and worldwide.",
};

export default function Layout({ children, navigation }: LayoutProps) {
  return (
    <html lang="en" className={cn("", jost.variable)}>
      <body className="font-sans flex flex-col h-screen">
        <TopNavigation />
        <div className="grid grid-cols-[400px_1fr] shrink grow">
          <div className="relative w-full">
            <div className="absolute top-0 bottom-0 left-0 right-0">
              <SideNavigation>{navigation}</SideNavigation>
            </div>
          </div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
