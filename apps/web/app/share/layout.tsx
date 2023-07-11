import { DarkModeProvider } from "ui";

import { TopNavigation } from "@views/layout/top-navigation";
import { getCachedCurrentUser, preload } from "@libs/cache";

type LayoutProps = {
  children: React.ReactNode;
  navigation: React.ReactNode;
};

export const metadata = {
  title: "AYDev | Hike",
  description: "Track and manage everything to do with hiking in the UK.",
};

export default async function Layout({ children, navigation }: LayoutProps) {
  const user = await getCachedCurrentUser();
  preload(user?.id);

  return (
    <div className="flex flex-col fixed w-full h-full bg-background">
      <DarkModeProvider>
        {/* @ts-expect-error Server Component */}
        <TopNavigation />
        <main className="flex-col w-full h-full hidden md:flex">{children}</main>
      </DarkModeProvider>
    </div>
  );
}
