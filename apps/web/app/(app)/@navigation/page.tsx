import { Suspense } from "react";
import { Skeleton } from "ui";

import { PeakEntry } from "@organisms/peak-entry";
import { getCachedCurrentUser, getCachedFellGroups, getCachedFlattenedTimelineEntries, preload } from "@libs/cache";

const NavigationEntries = async () => {
  const user = await getCachedCurrentUser();
  const entries = await getCachedFellGroups();

  const groups = await getCachedFlattenedTimelineEntries(user?.id);

  return (
    <div className="flex flex-col text-left divide-y rounded-lg p-2 bg-white">
      {entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry) => {
          const completedEntries = groups.filter((g) => g.fell.fellGroupIds.includes(entry.id));

          return (
            <PeakEntry key={entry.id} href={`/group/${entry.id}`} title={entry.name}>
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
    </div>
  );
};

const NavigationEntriesPlaceholder = () => {
  return (
    <div className="flex flex-col text-left divide-y rounded-lg gap-2 p-2 bg-white">
      {new Array(5).fill("").map((_, index) => (
        <Skeleton key={index} className="w-full h-[50px]" />
      ))}
    </div>
  );
};

const PeaksNavigation = async () => {
  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">All Groups</h1>
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
