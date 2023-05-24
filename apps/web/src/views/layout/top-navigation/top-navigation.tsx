import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button, cn, ElementProps, Separator, Skeleton } from 'ui';

import { getCurrentUser } from '@/libs/session';
import { Profile } from '@/views/layout/profile';
import { SignOutButton } from '@/views/layout/sign-out-button';

import { DrawerNavigation } from '../drawer-navigation';

type TopNavigationProps = Omit<ElementProps<"div">, "children">;

const MobileNavigation = async () => {
  const user = await getCurrentUser();
  const isUserAuthenticated = !!user;

  return (
    <DrawerNavigation isUserAuthenticated={isUserAuthenticated}>
      {/* @ts-expect-error Server Component */}
      <SignOutButton />
    </DrawerNavigation>
  );
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
    <div className="hidden md:flex gap-6 items-baseline">
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
      <Link legacyBehavior href="/profile">
        <Button className="text-md px-0 font-normal" variant="link" disabled={!isUserAuthenticated}>
          Profile
        </Button>
      </Link>
    </div>
  );
};

const DesktopLinksPlaceholder = () => {
  return (
    <div className="hidden md:flex gap-6 items-baseline">
      <Link legacyBehavior href="/">
        <Button className="text-md px-0 font-normal" variant="link">
          Fells
        </Button>
      </Link>
      <Link legacyBehavior href="/timeline">
        <Button variant="link" className="text-md px-0 font-normal" disabled>
          Timeline
        </Button>
      </Link>
      <Link legacyBehavior href="/data">
        <Button className="text-md px-0 font-normal" variant="link" disabled>
          Data
        </Button>
      </Link>
      <Link legacyBehavior href="/profile">
        <Button className="text-md px-0 font-normal" variant="link" disabled>
          Profile
        </Button>
      </Link>
    </div>
  );
};

const ProfilePlaceholder = () => {
  return (
    <div className="flex gap-2 items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="w-16 h-4 hidden md:block" />
      <Skeleton className="w-24 h-10 rounded-lg hidden md:block" />
    </div>
  );
};

export const TopNavigation = async ({ className, ...rest }: TopNavigationProps) => {
  const _className = cn("w-full justify-between shadow flex p-4 items-center border-b", className);

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
