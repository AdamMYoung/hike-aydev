import { SideNavigation, TopNavigation } from "@templates/index";
import { MapProvider, Map } from "ui";

import { MapInteraction } from "@templates/map/map-interaction/map-interaction";
import { ResetViewButton } from "@/components";
import { MobileMap } from "@templates/mobile-map";
import { DesktopMap } from "@templates/desktop-map";
import { RefreshCw } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
  navigation: React.ReactNode;
};

export const metadata = {
  title: "AYDev | Hike",
  description: "Track and manage your hiking achievements, across the UK and worldwide.",
};

export default async function Layout({ children, navigation }: LayoutProps) {
  return (
    <div className="flex flex-col fixed w-full h-full">
      {/* @ts-expect-error Server Component */}
      <TopNavigation />
      <div className="grid md:grid-cols-[400px_1fr] shrink grow">
        <MapProvider>
          <MapInteraction>
            <div className="relative w-full">
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-50">
                <SideNavigation>{navigation}</SideNavigation>
              </div>
              <MobileMap>{children}</MobileMap>
            </div>
            <main className="flex-col w-full h-full hidden md:flex">
              <DesktopMap>{children}</DesktopMap>
              <div className="hidden md:block absolute bottom-4 ml-4">
                <ResetViewButton>
                  <RefreshCw className="mr-2" />
                  Reset Position
                </ResetViewButton>
              </div>
            </main>
          </MapInteraction>
        </MapProvider>
      </div>
    </div>
  );
}
