import { PeakEntry } from "@/components/organisms";
import Link from "next/link";
import { Button, Separator } from "ui";
import { getFellGroup, getUserLogEntries } from "@/libs/requests";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/libs/session";
import { LogEntry } from "database";
import { PeakListEntry } from "@/components/organisms/peak-list-entry";
import { GroupSearchFilters } from "@templates/group-search-filters";

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
  const fellGroup = await getFellGroup(id);

  if (!fellGroup) {
    notFound();
  }

  const user = await getCurrentUser();
  const logEntries = await getUserLogEntries(user?.id);

  return (
    <div className="py-4 space-y-4 h-full">
      <div className="px-4 space-y-4">
        <Link href="/">
          <Button>Back</Button>
        </Link>
        <PeakEntry src={fellGroup.imageUrl ?? ""} title={fellGroup.name} />
      </div>

      <Separator />

      <div className="relative w-full space-y-4">
        <GroupSearchFilters isUserAuthenticated={!!user} />

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
  );
};

export default PeakDetailNavigation;
