"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Sheet, SheetContent, SheetHeader, SheetTrigger } from "ui";

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
        <Link legacyBehavior href="/">
          <Button className="text-md px-0 font-normal" variant="link">
            Fells
          </Button>
        </Link>
        <Link legacyBehavior href="/timeline">
          <Button variant="link" className="text-md px-0 font-normal" disabled={!isUserAuthenticated}>
            Timeline
          </Button>
        </Link>
        <Link legacyBehavior href="/data">
          <Button className="text-md px-0 font-normal" variant="link" disabled={!isUserAuthenticated}>
            Data
          </Button>
        </Link>
        {/* <Link legacyBehavior href="/profile">
          <Button className="text-md px-0 font-normal" variant="link" disabled={!isUserAuthenticated}>
            Profile
          </Button>
        </Link> */}
      </div>

      {children}
    </SheetContent>
  );
};
