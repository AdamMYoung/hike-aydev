import { notFound } from "next/navigation";
import { Suspense, cache } from "react";
import { PinGroup } from "ui";

import { getCurrentUser } from "@/libs/session";
import { GroupPin } from "@views/group/group-pin";
import { getUserTimelineById } from "database";
import { getCachedFellGroup, getCachedFells } from "@/libs/cache";

type GroupProps = {
  params: { id: string };
  searchParams: {
    hideComplete: string;
    hideIncomplete: string;
    searchTerm: string;
  };
};

const GroupEntries = async ({
  params: { id },
  searchParams: { hideComplete, hideIncomplete, searchTerm },
}: GroupProps) => {
  const [fellGroup, fells, user] = await Promise.all([
    getCachedFellGroup(parseInt(id)),
    getCachedFells(parseInt(id)),
    getCurrentUser(),
  ]);

  if (!fellGroup) {
    notFound();
  }

  const logEntries = await getUserTimelineById(user?.id);

  return (
    <PinGroup>
      {fells
        .filter((f) => (!searchTerm ? true : f.name.toLowerCase().includes(searchTerm.toLowerCase())))
        .map((fell) => {
          const isCompleted = !!logEntries.find((e) => e.climbed && e.fell.id === fell.id);

          if (hideComplete === "true" && isCompleted && user) {
            return null;
          }

          if (hideIncomplete === "true" && !isCompleted && user) {
            return null;
          }

          return <GroupPin key={fell.id} isCompleted={isCompleted} fell={fell} />;
        })}
    </PinGroup>
  );
};

const GroupEntriesPlaceholder = () => {
  return <div />;
};

export default async function Group(props: GroupProps) {
  return (
    <Suspense fallback={<GroupEntriesPlaceholder />}>
      {/* @ts-expect-error Server Component */}
      <GroupEntries {...props} />
    </Suspense>
  );
}
