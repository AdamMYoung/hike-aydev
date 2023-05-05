import { getFellGroup, getMapFellGroup, getUserLogEntries } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { LogEntry } from "database";
import { notFound } from "next/navigation";
import { PinGroup, Pin } from "ui";

type GroupProps = {
  params: { id: string };
  searchParams: {
    hideComplete: string;
    hideIncomplete: string;
    searchTerm: string;
  };
};

export default async function Group({
  params: { id },
  searchParams: { hideComplete, hideIncomplete, searchTerm },
}: GroupProps) {
  let logEntries: LogEntry[] = [];

  const user = await getCurrentUser();
  const fellGroup = await getMapFellGroup(id, searchTerm);

  if (!fellGroup) {
    notFound();
  }

  if (user) {
    logEntries = await getUserLogEntries(user.id);
  }

  return (
    <PinGroup>
      {fellGroup.fells.map((fell) => {
        const isCompleted = !!logEntries.find((e) => e.climbed && e.fellId === fell.id);

        if (hideComplete === "true" && isCompleted && user) {
          return null;
        }

        if (hideIncomplete === "true" && !isCompleted && user) {
          return null;
        }

        const iconSrc = isCompleted ? "/data/check-circle.svg" : "/data/cross-circle.svg";
        return <Pin key={fell.id} coordinates={[fell.lng, fell.lat]} iconSrc={iconSrc} />;
      })}
    </PinGroup>
  );
}
