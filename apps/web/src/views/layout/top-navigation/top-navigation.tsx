import { Menu } from "lucide-react";
import { Suspense } from "react";
import {
  cn,
  ElementProps,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  Separator,
  Skeleton,
} from "ui";

import { getCurrentUser } from "@libs/session";

import { DrawerNavigation } from "../drawer-navigation";

import { DesktopLinks } from "./desktop-links";
import { Profile } from "../profile";
import { DarkModeToggle } from "../dark-mode-toggle/dark-mode-toggle";

type TopNavigationProps = Omit<ElementProps<"div">, "children">;

const MobileNavigation = async () => {
  const user = await getCurrentUser();
  const isUserAuthenticated = !!user;

  return <DrawerNavigation isUserAuthenticated={isUserAuthenticated} />;
};

const DesktopNavigation = async () => {
  const user = await getCurrentUser();

  return <DesktopLinks isUserAuthenticated={!!user} />;
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
  const _className = cn(
    "w-full justify-between shadow flex px-4 md:pl-8 md:pr-2 py-2 items-center border-b",
    className
  );

  return (
    <div className={_className} {...rest}>
      <div className="flex gap-4 md:gap-4 items-center w-full">
        {/* @ts-expect-error Server Component */}
        <MobileNavigation />

        <span className="text-xl">
          <span className="font-semibold">Hike</span>
          <span className="font-light">.aydev</span>
        </span>

        {/* @ts-expect-error Server Component */}
        <DesktopNavigation />

        <div className="mx-auto" />
        <Suspense fallback={<ProfilePlaceholder />}>
          {/* @ts-expect-error Server Component */}
          <Profile />
        </Suspense>
        <DarkModeToggle />
      </div>
    </div>
  );
};
