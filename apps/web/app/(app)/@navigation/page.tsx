import { PeakEntry } from "@/components/organisms";
import { getFellGroups, getUserFellGroupCompletion } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";

const PeaksNavigation = async () => {
  const [user, entries] = await Promise.all([getCurrentUser(), getFellGroups()]);

  const logEntries = await getUserFellGroupCompletion(user?.id);

  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Fells</h1>
      <div className="p-2 flex flex-col gap-2 ">
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
    </div>
  );
};

export default PeaksNavigation;
