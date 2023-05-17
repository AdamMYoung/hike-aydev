import Link from "next/link";
import { Button, Separator } from "ui";
import { getFellGroup, getUserLogEntries } from "@/libs/requests";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/libs/session";
import { PeakListEntry } from "@/components/organisms/peak-list-entry";
import { GroupSearchFilters } from "@templates/group-search-filters";
import { Suspense } from "react";

type PeakDetailNavigationProps = {
  params: { id: string };
  searchParams: {
    hideComplete: string;
    hideIncomplete: string;
    searchTerm: string;
  };
};

const PeakDetailNavigation = async ({
  params: { id },
  searchParams: { hideComplete, hideIncomplete, searchTerm },
}: PeakDetailNavigationProps) => {
  const [fellGroup, user] = await Promise.all([getFellGroup(id), getCurrentUser()]);

  if (!fellGroup) {
    notFound();
  }

  const logEntries = await getUserLogEntries(user?.id);

  return (
    <div className="bg-white">
      <div className="h-full relative">
        {fellGroup.imageUrl ? <img className="[filter:brightness(0.8)]" alt="" src={fellGroup.imageUrl} /> : null}
        <div className="bg-white pt-4 sticky top-0 z-10 ">
          <div className="px-4 space-y-4">
            <div className="flex gap-4 items-center">
              <Link href="/">
                <Button variant="outline">Back</Button>
              </Link>
              <h2 className="text-xl font-medium">{fellGroup.name}</h2>
            </div>
            <Separator />
          </div>

          <Suspense fallback={<div />}>
            <GroupSearchFilters isUserAuthenticated={!!user} />
          </Suspense>
        </div>

        <div className="w-full space-y-4">
          <div className="px-4 py-2">
            {fellGroup.fells
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((f) => (!searchTerm ? true : f.name.toLowerCase().includes(searchTerm.toLowerCase())))
              .map((fell) => {
                const isCompleted = !!logEntries.find((e) => e.climbed && e.fellId === fell.id);

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

export default PeakDetailNavigation;
