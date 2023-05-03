"use client";

import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "ui";

export const SideNavigation = ({ children }: React.PropsWithChildren) => {
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
          <TabsTrigger value="">Peaks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
