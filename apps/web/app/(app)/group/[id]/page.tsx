import { notFound } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";

import {
  getCachedCurrentUser,
  getCachedFellGroup,
  getCachedFells,
  getCachedFlattenedTimelineEntries,
} from "@libs/cache";

const Pin = dynamic(() => import("ui").then((i) => i.Pin));
const PinGroup = dynamic(() => import("ui").then((i) => i.PinGroup));
const BoundingZoomPoint = dynamic(() => import("ui").then((i) => i.BoundingZoomPoint));

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
    getCachedCurrentUser(),
  ]);

  if (!fellGroup) {
    notFound();
  }

  const logEntries = await getCachedFlattenedTimelineEntries(user?.id);

  const parsedFells = fells
    .filter((f) => (!searchTerm ? true : f.name.toLowerCase().includes(searchTerm.toLowerCase())))
    .reduce((prev, curr) => {
      const isCompleted = !!logEntries.find((e) => e.climbed && e.fell.id === curr.id);

      if (hideComplete === "true" && isCompleted && user) {
        return prev;
      }

      if (hideIncomplete === "true" && !isCompleted && user) {
        return prev;
      }

      return [...prev, { isCompleted, fell: curr }];
    }, []);

  return (
    <>
      <BoundingZoomPoint points={parsedFells.map((f) => [f.fell.lng, f.fell.lat])} />
      <PinGroup>
        {parsedFells.map(({ isCompleted, fell }) => (
          <Pin key={fell.id} isCompleted={isCompleted} coordinates={[fell.lng, fell.lat]} name={fell.name} />
        ))}
      </PinGroup>
    </>
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
