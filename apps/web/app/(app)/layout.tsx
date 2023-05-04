import { Map } from "ui";
import { SideNavigation, TopNavigation } from "@templates/index";

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
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="grid grid-cols-[400px_1fr] shrink grow">
        <div className="relative w-full">
          <div className="absolute top-0 bottom-0 left-0 right-0">
            <SideNavigation>{navigation}</SideNavigation>
          </div>
        </div>
        <main className="flex flex-col w-full h-full">
          <Map>{children}</Map>
        </main>
      </div>
    </div>
  );
}
