import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Pin, PinGroup, ZoomPoint } from "ui";

import { getCachedCurrentUser, getCachedFlattenedTimelineEntries, getCachedUserTimelineById } from "@libs/cache";

type GroupProps = {
  params: { id: string };
  searchParams: {
    hideComplete: string;
    hideIncomplete: string;
    searchTerm: string;
  };
};

const TimelineEntries = async () => {
  const user = await getCachedCurrentUser();

  if (!user) {
    notFound();
  }

  const entries = await getCachedFlattenedTimelineEntries(user.id);

  return (
    <>
      <ZoomPoint coordinates={[-2.5478, 54.0039]} />

      <PinGroup>
        {entries.map(({ fell }) => {
          return <Pin key={fell.id} coordinates={[fell.lng, fell.lat]} name={fell.name} isCompleted />;
        })}
      </PinGroup>
    </>
  );
};

const TimelineEntriesPlaceholder = () => {
  return <div />;
};

export default async function Timeline({}: GroupProps) {
  return (
    <Suspense fallback={<TimelineEntriesPlaceholder />}>
      {/* @ts-expect-error Server Component */}
      <TimelineEntries />
    </Suspense>
  );
}
