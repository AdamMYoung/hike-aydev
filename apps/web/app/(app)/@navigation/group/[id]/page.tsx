import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button, Separator, Skeleton } from "ui";

import { GroupSearchFilters } from "@views/group/group-search-filters";
import { PeakListEntry } from "@views/group/peak-list-entry";
import {
  getCachedCurrentUser,
  getCachedFellGroup,
  getCachedFells,
  getCachedFlattenedTimelineEntries,
} from "@libs/cache";

type PeakDetailNavigationProps = {
  params: { id: string };
  searchParams: {
    hideComplete: string;
    hideIncomplete: string;
    searchTerm: string;
  };
};

const PeakDetailNavigationContent = async ({
  params: { id },
  searchParams: { hideComplete, hideIncomplete, searchTerm },
}: PeakDetailNavigationProps) => {
  const [fellGroup, fells] = await Promise.all([getCachedFellGroup(parseInt(id)), getCachedFells(parseInt(id))]);

  const user = await getCachedCurrentUser();

  if (!fellGroup) {
    notFound();
  }

  const entries = await getCachedFlattenedTimelineEntries(user?.id);

  return (
    <div className="bg-background">
      <div className="h-full relative">
        <div className="bg-background pt-4 sticky top-0 z-10 ">
          <div className="px-4 space-y-4">
            <div className="flex gap-4 items-center">
              <Link href="/">
                <Button variant="outline">Back</Button>
              </Link>
              <h2 className="text-xl font-medium">{fellGroup.name}</h2>
            </div>
            <Separator />
          </div>

          <GroupSearchFilters isUserAuthenticated={!!user} />
        </div>

        <div className="w-full space-y-4">
          <div className="px-4 py-2">
            {fells
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((f) => (!searchTerm ? true : f.name.toLowerCase().includes(searchTerm.toLowerCase())))
              .map((fell) => {
                const isCompleted = !!entries.find((e) => e.climbed && e.fell.id === fell.id);

                if (hideComplete === "true" && isCompleted && user) {
                  return null;
                }

                if (hideIncomplete === "true" && !isCompleted && user) {
                  return null;
                }

                return (
                  <PeakListEntry
                    key={fell.id}
                    fell={fell}
                    fellGroupId={fellGroup.id}
                    userId={user?.id ?? null}
                    checked={isCompleted}
                    disabled={!user}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const PeakDetailNavigationContentPlaceholder = () => {
  return (
    <div className="bg-background">
      <div className="h-full relative">
        <div className="bg-background pt-4 sticky top-0 z-10 ">
          <div className="px-4 space-y-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-32 h-6" />
            </div>
            <Separator />
          </div>

          <div className="flex flex-col gap-2 p-4 shadow">
            <Skeleton className="w-16 h-2" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="px-4 py-2">
            {new Array(20).fill("").map((_, index) => (
              <div key={index} className="flex gap-2 p-2 items-center">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="w-48 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PeakDetailNavigation = async (props: PeakDetailNavigationProps) => {
  return (
    <Suspense fallback={<PeakDetailNavigationContentPlaceholder />}>
      {/* @ts-expect-error Server Component */}
      <PeakDetailNavigationContent {...props} />
    </Suspense>
  );
};

export default PeakDetailNavigation;
