import { Menu } from "lucide-react";
import { Suspense } from "react";
import { cn, ElementProps, Separator, Skeleton } from "ui";

import { getCurrentUser } from "@libs/session";
import { Profile } from "@views/layout/profile";
import { SignOutButton } from "@views/layout/sign-out-button";

import { DrawerNavigation } from "../drawer-navigation";
import { NavigationLink } from "../navigation-link";

type TopNavigationProps = Omit<ElementProps<"div">, "children">;

const MobileNavigation = async () => {
  const user = await getCurrentUser();
  const isUserAuthenticated = !!user;

  return <DrawerNavigation isUserAuthenticated={isUserAuthenticated} />;
};

const MobileNavigationPlaceholder = () => {
  return (
    <div className="block md:hidden">
      <Menu />
    </div>
  );
};

const DesktopLinks = async () => {
  const user = await getCurrentUser();
  const isUserAuthenticated = !!user;

  return (
    <div className="hidden md:flex gap-2 items-baseline">
      <NavigationLink href="/">Fells</NavigationLink>
      <NavigationLink href="/timeline" disabled={!isUserAuthenticated}>
        Timeline
      </NavigationLink>
      <NavigationLink href="/data" disabled={!isUserAuthenticated}>
        Data
      </NavigationLink>
    </div>
  );
};

const DesktopLinksPlaceholder = () => {
  return (
    <div className="hidden md:flex gap-2 items-baseline">
      <Skeleton className="h-6 w-12 rounded-full" />
      <Skeleton className="h-6 w-12 rounded-full" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );
};

const ProfilePlaceholder = () => {
  return (
    <div className="flex gap-2 items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="w-16 h-4 hidden md:block" />
    </div>
  );
};

export const TopNavigation = async ({ className, ...rest }: TopNavigationProps) => {
  const _className = cn("w-full justify-between shadow flex px-4 py-2 items-center border-b", className);

  return (
    <div className={_className} {...rest}>
      <div className="flex gap-2 md:gap-6 items-center">
        <Suspense fallback={<MobileNavigationPlaceholder />}>
          {/* @ts-expect-error Server Component */}
          <MobileNavigation />
        </Suspense>

        <span className="text-2xl md:text-3xl w-full">
          <span className="font-semibold">Hike</span>
          <span className="font-light">.aydev</span>
        </span>

        <Separator className="h-12 hidden md:block" orientation="vertical" />

        <Suspense fallback={<DesktopLinksPlaceholder />}>
          {/* @ts-expect-error Server Component */}
          <DesktopLinks />
        </Suspense>
      </div>

      <Suspense fallback={<ProfilePlaceholder />}>
        {/* @ts-expect-error Server Component */}
        <Profile />
      </Suspense>
    </div>
  );
};
