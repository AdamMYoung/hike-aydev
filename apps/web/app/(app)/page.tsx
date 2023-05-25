import { Suspense } from "react";
import { Pin, PinGroup, toOSMCoordinates, ZoomPoint } from "ui";

import { getCurrentUser } from "@/libs/session";
import { getUserTimelineById } from "database";

const MapEntries = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <ZoomPoint coordinates={toOSMCoordinates([-2.5478, 54.0039])} />;
  }

  const timeline = await getUserTimelineById(user.id);

  return (
    <>
      <ZoomPoint coordinates={toOSMCoordinates([-2.5478, 54.0039])} />
      <PinGroup disableAnimation>
        {timeline.map(({ fell }) => {
          return <Pin key={fell.id} coordinates={[fell.lng, fell.lat]} iconSrc="/data/check-circle.svg" />;
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
