import { PeakEntry } from "@/components/organisms";
import { getFellGroups, getUserFellGroupCompletion } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";

const PeaksNavigation = async () => {
  const user = await getCurrentUser();
  const entries = await getFellGroups();

  const logEntries = await getUserFellGroupCompletion(user);

  console.log(logEntries);

  return (
    <div className="py-2 space-y-4 h-full">
      {entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry) => {
          const completedEntries = logEntries.find((e) => e.id === entry.id);

          return (
            <PeakEntry key={entry.id} href={`/group/${entry.id}`} src={entry.imageUrl ?? ""} title={entry.name}>
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
