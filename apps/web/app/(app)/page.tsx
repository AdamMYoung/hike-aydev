import { Suspense } from "react";
import { Pin, PinGroup, ZoomPoint } from "ui";

import { getCachedCurrentUser, getCachedFlattenedTimelineEntries } from "@libs/cache";

const MapEntries = async () => {
  const user = await getCachedCurrentUser();

  if (!user) {
    return <ZoomPoint coordinates={[-2.5478, 54.0039]} />;
  }

  const entries = await getCachedFlattenedTimelineEntries(user.id);

  return (
    <>
      <ZoomPoint coordinates={[-2.5478, 54.0039]} />

      <PinGroup>
        {entries.map(({ fell }) => {
          return <Pin key={fell.id} coordinates={[fell.lng, fell.lat]} isCompleted />;
        })}
      </PinGroup>
    </>
  );
};

const MapEntriesPlaceholder = () => {
  return <div />;
};

export default async function Home() {
  return (
    <Suspense fallback={<MapEntriesPlaceholder />}>
      {/* @ts-expect-error Server Component */}
      <MapEntries />
    </Suspense>
  );
}
