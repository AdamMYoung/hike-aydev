import { Suspense, cache } from "react";
import { Skeleton } from "ui";
import { getCompletedFellsGroupedByFellGroups } from "database";

import { PeakEntry } from "@/components/organisms";
import { getCurrentUser } from "@/libs/session";
import { getCachedFellGroups } from "@/libs/cache";

const NavigationEntries = async () => {
  const [user, entries] = await Promise.all([getCurrentUser(), getCachedFellGroups()]);
  const logEntries = await getCompletedFellsGroupedByFellGroups(user?.id);

  return (
    <>
      {entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry) => {
          const completedEntries = logEntries[entry.id] ?? [];

          return (
            <PeakEntry key={entry.id} href={`/group/${entry.id}`} src={entry.imageUrl ?? ""} title={entry.name}>
              {user ? (
                <p className="text-sm">
                  {completedEntries.length}/{entry.fellCount} complete
                </p>
              ) : (
                <p className="text-sm">{entry.fellCount} fells</p>
              )}
            </PeakEntry>
          );
        })}
    </>
  );
};

const NavigationEntriesPlaceholder = () => {
  return (
    <>
      {new Array(5).fill("").map((_, index) => (
        <div key={index} className="flex flex-col gap-2 p-2 text-left border rounded-lg bg-white">
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-48 h-4" />
        </div>
      ))}
    </>
  );
};

const PeaksNavigation = async () => {
  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Fells</h1>
      <div className="p-2 flex flex-col gap-2">
        <Suspense fallback={<NavigationEntriesPlaceholder />}>
          {/* @ts-expect-error Server Component */}
          <NavigationEntries />
        </Suspense>
      </div>
    </div>
  );
};

export default PeaksNavigation;
