import Link from "next/link";
import { Button, Separator, Skeleton } from "ui";
import { getFellGroup, getUserLogEntries } from "@/libs/requests";
import { notFound, useSearchParams } from "next/navigation";
import { getCurrentUser } from "@/libs/session";
import { PeakListEntry } from "@/components/organisms/peak-list-entry";
import { GroupSearchFilters } from "@templates/group-search-filters";
import { Suspense } from "react";
import Image from "next/image";

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
  const fellGroup = await getFellGroup(id);
  const user = await getCurrentUser();

  if (!fellGroup) {
    notFound();
  }

  const logEntries = await getUserLogEntries(user?.id);

  return (
    <div className="bg-white">
      <div className="h-full relative">
        {fellGroup.imageUrl ? (
          <Image
            width="0"
            height="0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-auto [filter:brightness(0.8)]"
            alt=""
            src={fellGroup.imageUrl}
          />
        ) : null}
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

          <GroupSearchFilters isUserAuthenticated={!!user} />
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

const PeakDetailNavigationContentPlaceholder = () => {
  return (
    <div className="bg-white">
      <div className="h-full relative">
        <Skeleton className="w-full h-64" />
        <div className="bg-white pt-4 sticky top-0 z-10 ">
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
