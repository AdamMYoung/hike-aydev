import { PeakEntry } from "@/components/organisms";
import { getFellGroups, getUserFellGroupCompletion } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { Separator } from "ui";

const PeaksNavigation = async () => {
  const [user, entries] = await Promise.all([getCurrentUser(), getFellGroups()]);

  const logEntries = await getUserFellGroupCompletion(user?.id);

  return (
    <div className="py-4 divide-y flex flex-col">
      {entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry) => {
          const completedEntries = logEntries.find((e) => e.id === entry.id);

          return (
            <PeakEntry
              className="p-4"
              key={entry.id}
              href={`/group/${entry.id}`}
              src={entry.imageUrl ?? ""}
              title={entry.name}
            >
              {user ? (
                <p className="text-sm">
                  {completedEntries?._count.fells}/{entry._count.fells} complete
                </p>
              ) : (
                <p className="text-sm">{entry._count.fells} fells</p>
              )}
            </PeakEntry>
          );
        })}
    </div>
  );
};

export default PeaksNavigation;
