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
    <SheetTrigger className="block md:hidden" aria-label="Open navigation menu">
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
      <div className="flex flex-col items-start grow">
        <NavigationLink href="/">Fells</NavigationLink>
        <NavigationLink href="/timeline" disabled={!isUserAuthenticated}>
          Timeline
        </NavigationLink>
        <NavigationLink href="/data" disabled={!isUserAuthenticated}>
          Data
        </NavigationLink>
      </div>

      {children}
    </SheetContent>
  );
};
