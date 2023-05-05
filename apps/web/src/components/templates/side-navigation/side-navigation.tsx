"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "ui";

type SideNavigationProps = React.PropsWithChildren & {
  isUserAuthenticated: boolean;
};

export const SideNavigation = ({ children, isUserAuthenticated }: SideNavigationProps) => {
  const { push } = useRouter();

  const handleValueChange = useCallback(
    (value: string) => {
      push(value);
    },
    [push]
  );

  return (
    <Tabs defaultValue="" onValueChange={handleValueChange} className="relative h-full overflow-y-auto">
      <div className="px-4 py-2 z-10 sticky top-0 bg-white shadow">
        <TabsList>
          <Link href="/" legacyBehavior>
            <TabsTrigger value="">Peaks</TabsTrigger>
          </Link>
          <Link href="/timeline" legacyBehavior>
            <TabsTrigger disabled={!isUserAuthenticated} value="timeline">
              Timeline
            </TabsTrigger>
          </Link>
          <Link href="/integrations" legacyBehavior>
            <TabsTrigger disabled value="integrations">
              Integrations
            </TabsTrigger>
          </Link>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
