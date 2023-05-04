import { PeakEntry } from "@/components/organisms";
import { getFells } from "@/libs/requests";

const PeaksNavigation = async () => {
  const entries = await getFells();

  return (
    <div className="py-2 space-y-4 h-full">
      {entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entry) => (
          <PeakEntry key={entry.id} href={`/group/${entry.id}`} src={entry.imageUrl ?? ""} title={entry.name}>
            <p className="text-sm">{entry._count.fells} fells</p>
          </PeakEntry>
        ))}
    </div>
  );
};

export default PeaksNavigation;
