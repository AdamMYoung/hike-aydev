import { getMapFellGroup, getUserLogEntries } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PinGroup } from "ui";
import { GroupPin } from "./group-pin";

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
  const [fellGroup, user] = await Promise.all([getMapFellGroup(id), getCurrentUser()]);

  if (!fellGroup) {
    notFound();
  }

  const logEntries = await getUserLogEntries(user?.id);

  return (
    <PinGroup>
      {fellGroup.fells
        .filter((f) => (!searchTerm ? true : f.name.toLowerCase().includes(searchTerm.toLowerCase())))
        .map((fell) => {
          const isCompleted = !!logEntries.find((e) => e.climbed && e.fellId === fell.id);

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
