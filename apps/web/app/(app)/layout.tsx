import dynamic from "next/dynamic";
import { RefreshCw } from "lucide-react";

import { SideNavigation } from "@views/layout/side-navigation";
import { TopNavigation } from "@views/layout/top-navigation";
import { ResetViewButton } from "@views/layout/reset-view-button";
import { getCachedCurrentUser, preload } from "@libs/cache";

const MapProvider = dynamic(() => import("ui").then((i) => i.MapProvider));
const MobileMap = dynamic(() => import("@views/layout/mobile-map").then((i) => i.MobileMap));
const DesktopMap = dynamic(() => import("@views/layout/desktop-map").then((i) => i.DesktopMap));

type LayoutProps = {
  children: React.ReactNode;
  navigation: React.ReactNode;
};

export const metadata = {
  title: "AYDev | Hike",
  description: "Track and manage your hiking achievements, across the UK and worldwide.",
};

export default async function Layout({ children, navigation }: LayoutProps) {
  const user = await getCachedCurrentUser();
  preload(user?.id);

  return (
    <div className="flex flex-col fixed w-full h-full">
      {/* @ts-expect-error Server Component */}
      <TopNavigation />
      <div className="grid md:grid-cols-[300px_1fr] xl:grid-cols-[400px_1fr] shrink grow">
        <MapProvider>
          <div className="relative w-full">
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-50">
              <SideNavigation>{navigation}</SideNavigation>
            </div>
            <MobileMap>{children}</MobileMap>
          </div>
          <main className="flex-col w-full h-full hidden md:flex">
            <DesktopMap>{children}</DesktopMap>
            <div className="hidden md:block absolute bottom-4 ml-4 z-20">
              <ResetViewButton>
                <RefreshCw className="mr-2" />
                Reset Position
              </ResetViewButton>
            </div>
          </main>
        </MapProvider>
      </div>
    </div>
  );
}
