import { Map } from "ui";

import { SideNavigation, TopNavigation } from "@templates/index";
import { getCurrentUser } from "@/libs/session";
import { MapProvider } from "ui";
import { MapInteraction } from "./map-interaction";
import { GroupInteraction } from "./group-interaction";

type LayoutProps = {
  children: React.ReactNode;
  navigation: React.ReactNode;
};

export const metadata = {
  title: "AYDev | Hike",
  description: "Track and manage your hiking achievements, across the UK and worldwide.",
};

export default async function Layout({ children, navigation }: LayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation />
      <div className="grid md:grid-cols-[400px_1fr] shrink grow">
        <MapProvider>
          <MapInteraction>
            <GroupInteraction>
              <div className="relative w-full">
                <div className="absolute top-0 bottom-0 left-0 right-0">
                  <SideNavigation isUserAuthenticated={!!user}>{navigation}</SideNavigation>
                </div>
              </div>
              <main className="flex-col w-full h-full hidden md:flex">
                <Map>{children}</Map>
              </main>
            </GroupInteraction>
          </MapInteraction>
        </MapProvider>
      </div>
    </div>
  );
}
