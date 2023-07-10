"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "ui";
import { NavigationLink } from "../navigation-link";

type DrawerProps = React.PropsWithChildren & {
  isUserAuthenticated: boolean;
};

export const DrawerNavigation = ({ children, ...rest }: DrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <DrawerNavigationButton />
      <DrawerNavigationContent {...rest}>{children}</DrawerNavigationContent>
    </Sheet>
  );
};

const DrawerNavigationButton = () => {
  return (
    <SheetTrigger className="block md:hidden py-2" aria-label="Open navigation menu">
      <Menu />
    </SheetTrigger>
  );
};

const DrawerNavigationContent = ({ isUserAuthenticated, children }: DrawerProps) => {
  return (
    <SheetContent className="flex flex-col gap-4" position="left" size="lg">
      <SheetHeader>
        <span className="text-xl w-full text-left">
          <span className="font-semibold">Hike</span>
          <span className="font-light">.aydev</span>
        </span>
      </SheetHeader>
      <div className="flex flex-col gap-2 text-light items-start grow">
        <p className="font-semibold">Tracking</p>
        {isUserAuthenticated ? (
          <NavigationLink className="text-gray-500" href="/timeline">
            Timeline
          </NavigationLink>
        ) : null}

        <NavigationLink href="/">All Groups</NavigationLink>
        <NavigationLink href="/group/1">Wainwrights</NavigationLink>
        <NavigationLink href="/group/2">Munros</NavigationLink>

        {isUserAuthenticated ? (
          <>
            <p className="font-semibold">Gear</p>
            <NavigationLink href="/gear">Your Gear</NavigationLink>
            <NavigationLink href="/gear/stats">Gear Statistics</NavigationLink>
          </>
        ) : null}

        {isUserAuthenticated ? (
          <>
            <p className="font-semibold">Profile</p>
            <NavigationLink href="/profile">Your Profile</NavigationLink>
          </>
        ) : null}
      </div>

      {children}
    </SheetContent>
  );
};
