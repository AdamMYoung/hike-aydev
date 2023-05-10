"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "ui";

type SideNavigationProps = React.PropsWithChildren & {
  isUserAuthenticated: boolean;
};

export const SideNavigation = ({ children, isUserAuthenticated }: SideNavigationProps) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const handleValueChange = useCallback(
    (value: string) => {
      push(value);
    },
    [push]
  );

  const tabsValue = useMemo(() => {
    if (pathname === "/timeline") {
      return "timeline";
    }

    if (pathname === "/integrations") {
      return "integrations";
    }

    return "";
  }, [pathname]);

  return (
    <Tabs value={tabsValue} onValueChange={handleValueChange} className="relative h-full overflow-y-auto">
      <div className="px-4 py-2 z-10 sticky top-0 bg-white shadow">
        <TabsList>
          <Link href="/" prefetch={false} legacyBehavior>
            <TabsTrigger value="">Peaks</TabsTrigger>
          </Link>
          <Link href="/timeline" prefetch={false} legacyBehavior>
            <TabsTrigger disabled={!isUserAuthenticated} value="timeline">
              Timeline
            </TabsTrigger>
          </Link>
          <Link href="/integrations" prefetch={false} legacyBehavior>
            <TabsTrigger disabled={!isUserAuthenticated} value="integrations">
              Integrations
            </TabsTrigger>
          </Link>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
